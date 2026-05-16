import mongoose from "mongoose";
import SaleMaster from "../../model/salemaster.js";

const renewals = async ({ branchid, startdate, enddate }) => {
  if (!branchid || !startdate || !enddate) {
    throw new Error("Missing required query parameters");
  }

  // 📅 Start of range
  const start = new Date(startdate);
  start.setHours(0, 0, 0, 0);

  // 📅 End of range
  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  const result = await SaleMaster.countDocuments({
    branchId: new mongoose.Types.ObjectId(branchid),

    saleType: "RW",

    saleDate: {
      $gte: start,
      $lte: end,
    },

    status: {
      $nin: ["CANCELLED", "REFUNDED"],
    },
  });

  return result;
};

export default renewals;
