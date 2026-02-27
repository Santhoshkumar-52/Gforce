import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import membermaster from "../../model/customermaster.js";
import m_attendanceLog from "../../model/memberattendance.js";

dotenv.config();

const attedanceRouter = express.Router();
const DBSERVERURL = process.env.DBSERVERURL;

attedanceRouter.post("/checkin", async (req, res) => {
  console.log("Checking Attendance for Member");

  try {
    const { branchid, memberid } = req.body;
    if (!branchid || !memberid) {
      return res.status(400).json({
        status: "error",
        message: "Branch ID and Member ID never Received for API Server",
      });
    }

    const { ObjectId } = mongoose.Types;

    const result = await membermaster.aggregate([
      {
        $match: {
          customerId: parseInt(memberid),
          branchId: new ObjectId(branchid),
        },
      },
      {
        $lookup: {
          from: "memberplan",
          let: { memberId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$memberId", "$$memberId"] },
                    { $eq: ["$isExpired", false] },
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
            {
              $sort: { _id: -1 }, // latest plan
            },
            {
              $limit: 1,
            },
          ],
          as: "latestPlan",
        },
      },
      {
        $unwind: {
          path: "$latestPlan",
          preserveNullAndEmptyArrays: false, // if no plan exists
        },
      },
      {
        $addFields: {
          "latestPlan.expiryDate": {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$latestPlan.expiryDate",
            },
          },
        },
      },
      {
        $lookup: {
          from: "planmaster",
          let: { planId: "$latestPlan.planId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id", "$$planId"] },
                    { $eq: ["$is_active", true] },
                    // add more conditions here
                  ],
                },
              },
            },
          ],
          as: "planDetails",
        },
      },
      {
        $unwind: {
          path: "$planDetails",
          preserveNullAndEmptyArrays: false, // like INNER JOIN
        },
      },
    ]);

    if (result.length < 1) {
      return res.status(200).json({
        status: "info",
        message:
          "Oops, No Plan Found for this Member.Try later or Please Contact Admin",
      });
    }

    const attendanceRecord = await m_attendanceLog.create({
      branchId: new ObjectId(branchid),
      memberId: result[0]._id,
      checkIn: new Date(),
      status: "IN",
    });

    console.log("Plan Found for this Member");

    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (error) {
    console.error("Error in attendance route:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing attendance data",
    });
  }
});

export default attedanceRouter;
