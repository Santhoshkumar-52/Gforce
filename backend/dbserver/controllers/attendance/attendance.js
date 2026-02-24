import express from "express";
const attedanceRouter = express.Router();
import mongoose from "mongoose";
import memberplan from "../../model/memberplan.js";
import membermaster from "../../model/customermaster.js";
import m_attendanceLog from "../../model/memberattendance.js";

attedanceRouter.post("/checkin", async (req, res) => {
  console.log("Received Member Id for Member Attendance");
  const { branchid, memberid } = req.body;

  //   const result = await membermaster.findOne({ _id: memberid, branchId: branchid });

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
});

export default attedanceRouter;
