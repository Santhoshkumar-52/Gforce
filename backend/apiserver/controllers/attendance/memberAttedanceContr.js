import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import memberplan from "../../model/memberplan.js";
import membermaster from "../../model/customermaster.js";
import m_attendanceLog from "../../model/memberattendance.js";

dotenv.config();

const router = express.Router();
const { ObjectId } = mongoose.Types;

const getToday = () => new Date().toISOString().split("T")[0];

router.post("/checkin", async (req, res) => {
  try {
    const { branchid, memberid } = req.body;

    if (!branchid || !memberid) {
      return res.status(400).json({
        status: "error",
        message: "Branch ID and Member ID required",
      });
    }

    const today = getToday();

    const member = await membermaster.aggregate([
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
                    { $eq: ["$isActive", true] },
                  ],
                },
              },
            },
            { $sort: { _id: -1 } },
            { $limit: 1 },
          ],
          as: "latestPlan",
        },
      },
      { $unwind: "$latestPlan" },
      {
        $lookup: {
          from: "planmaster",
          localField: "latestPlan.planId",
          foreignField: "_id",
          as: "planDetails",
        },
      },
      { $unwind: "$planDetails" },
      {
        $lookup: {
          from: "staffmaster",
          localField: "latestPlan.allotedstaff",
          foreignField: "_id",
          as: "staffDetails",
        },
      },
      { $unwind: "$staffDetails" },
      {
        $addFields: {
          daysRemaining: {
            $dateDiff: {
              startDate: new Date(),
              endDate: "$latestPlan.expiryDate",
              unit: "day",
            },
          },
          "latestPlan.expiryDateFormatted": {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$latestPlan.expiryDate",
            },
          },
        },
      },
    ]);

    if (!member.length) {
      return res.status(200).json({
        status: "info",
        message: "No active plan found",
      });
    }

    const memberData = member[0];

    const existing = await m_attendanceLog.exists({
      branchId: new ObjectId(branchid),
      memberId: memberData._id,
      attendanceDate: today,
    });

    if (existing) {
      return res.status(200).json({
        status: "info",
        message: "Already checked in today",
      });
    }

    const attendance = await m_attendanceLog.create({
      branchId: new ObjectId(branchid),
      memberId: memberData._id,
      checkIn: new Date(),
      attendanceDate: today,
      status: "IN",
    });

    const report = await m_attendanceLog.aggregate([
      {
        $match: {
          memberId: memberData._id,
        },
      },
      {
        $facet: {
          // 📊 1️⃣ Date-wise report
          report: [
            { $sort: { checkIn: 1 } },
            {
              $group: {
                _id: "$attendanceDate",
                firstCheckIn: { $first: "$checkIn" },
                lastCheckOut: { $last: "$checkOut" },
                finalStatus: { $last: "$status" },
                totalDurationPerDay: { $sum: "$durationMinutes" },
                totalVisitsPerDay: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                date: "$_id",
                checkIn: "$firstCheckIn",
                checkOut: "$lastCheckOut",
                status: "$finalStatus",
                duration: "$totalDurationPerDay",
              },
            },
            { $sort: { date: -1 } },
          ],

          // 📈 2️⃣ Overall summary
          summary: [
            {
              $group: {
                _id: null,
                totalDuration: { $sum: "$durationMinutes" },
                totalCheckins: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalDuration: 1,
                totalCheckins: 1,
              },
            },
          ],
        },
      },
    ]);
    return res.status(200).json({
      status: "ok",
      message: "Check-in successful",
      attendance,
      member: memberData,
      report,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Check-in failed",
    });
  }
});

router.post("/checkout", async (req, res) => {
  try {
    const { branchid, memberid } = req.body;

    if (!branchid || !memberid) {
      return res.status(400).json({
        status: "error",
        message: "Branch ID and Member ID required",
      });
    }

    const today = getToday();

    // 🔍 Find member
    const member = await membermaster.findOne({
      customerId: parseInt(memberid),
      branchId: new ObjectId(branchid),
    });

    if (!member) {
      return res.status(200).json({
        status: "info",
        message: "Member not found",
      });
    }

    // 🔍 Find today's check-in (latest IN without OUT)
    const attendance = await m_attendanceLog
      .findOne({
        memberId: member._id,
        branchId: new ObjectId(branchid),
        attendanceDate: today,
        status: "IN",
      })
      .sort({ checkIn: -1 });

    if (!attendance) {
      return res.status(200).json({
        status: "info",
        message: "No active check-in found for today",
      });
    }

    const now = new Date();

    // ⏱️ Calculate duration in minutes
    const durationMinutes = Math.floor(
      (now - new Date(attendance.checkIn)) / (1000 * 60),
    );

    // 📝 Update record
    attendance.checkOut = now;
    attendance.durationMinutes = durationMinutes;
    attendance.status = "OUT";

    await attendance.save();

    return res.status(200).json({
      status: "ok",
      message: "Check-out successful",
      data: {
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        durationMinutes,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Check-out failed",
    });
  }
});

export default router;
