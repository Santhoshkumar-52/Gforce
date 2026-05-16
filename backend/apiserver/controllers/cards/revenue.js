import mongoose from "mongoose";
import SaleMaster from "../../model/salemaster.js";

const revenue = async ({ branchid, startdate, enddate }) => {
  if (!branchid || !startdate || !enddate) {
    throw new Error("Missing required query parameters");
  }

  const start = new Date(startdate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  const result = await SaleMaster.aggregate([
    {
      $match: {
        branchId: new mongoose.Types.ObjectId(branchid),

        saleDate: {
          $gte: start,
          $lte: end,
        },

        status: {
          $nin: ["CANCELLED", "REFUNDED"],
        },
      },
    },

    {
      $group: {
        _id: null,

        totalRevenue: {
          $sum: "$paidAmount",
        },
      },
    },
  ]);

  return result[0]?.totalRevenue || 0;
};

export default revenue;
