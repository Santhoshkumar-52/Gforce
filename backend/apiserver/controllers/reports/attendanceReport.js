import mongoose from "mongoose";
import express from "express";
import m_attendanceLog from "../../model/memberattendance.js";

const attRepRouter = express.Router();

attRepRouter.get("/m_attendance", async (req, res) => {
  try {
    const { branchid, fromdate, todate } = req.query;

    if (!branchid || !fromdate || !todate) {
      return res.status(400).json({
        icon: "error",
        message: "branchid, fromdate and todate never received",
      });
    }

    const data = await m_attendanceLog.aggregate([
      {
        $match: {
          branchId: new mongoose.Types.ObjectId(branchid),
          attendanceDate: { $gte: fromdate, $lte: todate },
        },
      },
      {
        $lookup: {
          from: "membermaster",
          localField: "memberId",
          foreignField: "_id",
          as: "memberInfo",
        },
      },
      { $unwind: "$memberInfo" },

      // ✅ SORT STAGE
      { $sort: { attendanceDate: -1, checkIn: -1 } },

      {
        $project: {
          "memberInfo.firstname": 1,
          "memberInfo.customerId": 1,
          checkIn: 1,
          checkOut: 1,
          durationMinutes: 1,
          status: 1,
          autoEnd: 1,
          autoEndReason: 1,
          attendanceDate: 1,
          source: 1,
        },
      },
    ]);

    res.json({
      icon: "success",
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      icon: "error",
      title: "Something went wrong",
      message: "Try again later",
    });
  }
});
attRepRouter.put("/autoCheckout", async (req, res) => {
  const { branchid, startdate, enddate, reason } = req.body;

  if (!branchid || !startdate || !enddate) {
    return res.status(400).json({
      icon: "error",
      title: "Missing Fields",
      message: "Branch, start date and end date are required",
    });
  }

  try {
    const result = await m_attendanceLog.updateMany(
      {
        branchId: new mongoose.Types.ObjectId(branchid),
        checkOut: null,
        status: "IN",
        attendanceDate: {
          $gte: startdate,
          $lte: enddate,
        },
      },
      {
        $set: {
          status: "OUT",
          checkOut: new Date(),
          autoEnd: true,
          autoEndReason: reason,
          updatedAt: new Date(),
          source: "SYSTEM",
        },
      },
    );

    return res.status(200).json({
      icon: "success",
      title: "Auto Checkout Completed",
      message: `${result.modifiedCount} members were checked out successfully`,
      count: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      icon: "error",
      title: "Server Error",
      message: "Something went wrong. Try again later.",
    });
  }
});
export default attRepRouter;
