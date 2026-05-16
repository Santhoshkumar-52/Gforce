import mongoose from "mongoose";
import SaleMaster from "../../model/salemaster.js";

const pendingpayments = async ({ branchid, enddate }) => {
  if (!branchid || !enddate) {
    throw new Error("Missing required query parameters");
  }

  // 📅 End of selected day
  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  // ✅ Pending payments AS OF selected date
  const result = await SaleMaster.countDocuments({
    branchId: new mongoose.Types.ObjectId(branchid),

    saleDate: {
      $lte: end,
    },

    // Pending balance exists
    balance: {
      $gt: 0,
    },

    // Ignore cancelled/refunded bills
    status: {
      $nin: ["CANCELLED", "REFUNDED"],
    },
  });

  return result;
};

export default pendingpayments;
