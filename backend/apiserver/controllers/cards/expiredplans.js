import mongoose from "mongoose";
import MemberPlan from "../../model/memberplan.js";

const expiredplans = async ({ branchid, enddate }) => {
  if (!branchid || !enddate) {
    throw new Error("Missing required query parameters");
  }

  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  const result = await MemberPlan.countDocuments({
    branchId: new mongoose.Types.ObjectId(branchid),

    expiryDate: {
      $lt: end,
    },

    cancelled: false,
  });

  return result;
};

export default expiredplans;
