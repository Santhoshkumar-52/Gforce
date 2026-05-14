// reports/salechartreport.js

import mongoose from "mongoose";
import SaleMaster from "../../model/salemaster.js";

import {
  getGroupingType,
  getGroupStage,
  normalizeChartData,
} from "../../utils/chartGrouping.js";

const salechartreport = async ({ branchid, startdate, enddate }) => {
  const groupType = getGroupingType(startdate, enddate);

  const groupStage = getGroupStage(groupType);

  const rows = await SaleMaster.aggregate([
    {
      $match: {
        branchId: new mongoose.Types.ObjectId(branchid),

        saleDate: {
          $gte: new Date(startdate),
          $lte: new Date(enddate),
        },
      },
    },

    {
      $group: {
        _id: groupStage,

        totalSales: {
          $sum: "$nettAmount",
        },

        totalBills: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        "_id.label": 1,
        "_id.year": 1,
        "_id.week": 1,
      },
    },
  ]);

  return normalizeChartData(rows, groupType, "totalSales", "Sales");
};

export default salechartreport;
