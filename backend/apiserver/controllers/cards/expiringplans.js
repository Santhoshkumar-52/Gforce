import mongoose from "mongoose";
import MemberPlan from "../../model/memberplan.js";

const expiringplans = async ({ branchid, enddate }) => {
  if (!branchid || !enddate) {
    throw new Error("Missing required query parameters");
  }

  // 📅 Selected date
  const start = new Date(enddate);
  start.setHours(0, 0, 0, 0);

  // 📅 Next 7 days
  const next7Days = new Date(start);
  next7Days.setDate(next7Days.getDate() + 7);
  next7Days.setHours(23, 59, 59, 999);

  const result = await MemberPlan.countDocuments({
    branchId: new mongoose.Types.ObjectId(branchid),

    expiryDate: {
      $gte: start,
      $lte: next7Days,
    },

    cancelled: false,
  });

  return result;
};

export default expiringplans;
