import mongoose from "mongoose";
import MemberPlan from "../../model/memberplan.js";

const activeplans = async ({ branchid, enddate }) => {
  if (!branchid || !enddate) {
    throw new Error("Missing required query parameters");
  }

  // 📅 End of selected day
  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  // ✅ Active plans AS OF selected date
  const result = await MemberPlan.countDocuments({
    branchId: new mongoose.Types.ObjectId(branchid),

    // Plan should already be started
    startDate: {
      $lte: end,
    },

    // Plan should not be expired yet
    expiryDate: {
      $gte: end,
    },
    cancelled: false,
  });

  return result;
};

export default activeplans;
