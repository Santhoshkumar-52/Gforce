import mongoose from "mongoose";
import Attendance from "../../model/memberattendance.js";

const attendancecount = async ({ branchid, startdate, enddate }) => {
  if (!branchid || !startdate || !enddate) {
    throw new Error("Missing required query parameters");
  }

  const result = await Attendance.countDocuments({
    branchId: new mongoose.Types.ObjectId(branchid),

    attendanceDate: {
      $gte: startdate,
      $lte: enddate,
    },
  });

  return result;
};

export default attendancecount;
