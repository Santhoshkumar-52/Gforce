import mongoose from "mongoose";
import SaleMaster from "../../model/salemaster.js";

const salechartreport = async ({ branchid, startdate, enddate }) => {
  const start = new Date(startdate);

  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  // days difference
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // dynamic grouping
  let groupFormat = {
    year: { $year: "$saleDate" },
    month: { $month: "$saleDate" },
  };

  let labelType = "month";

  if (diffDays <= 14) {
    groupFormat = {
      year: { $year: "$saleDate" },
      month: { $month: "$saleDate" },
      day: { $dayOfMonth: "$saleDate" },
    };

    labelType = "day";
  } else if (diffDays > 730) {
    groupFormat = {
      year: { $year: "$saleDate" },
    };

    labelType = "year";
  }

  const result = await SaleMaster.aggregate([
    {
      $match: {
        branchId: new mongoose.Types.ObjectId(branchid),

        saleDate: {
          $gte: start,
          $lte: end,
        },
      },
    },

    {
      $group: {
        _id: groupFormat,

        totalSales: {
          $sum: "$nettAmount",
        },
      },
    },

    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
      },
    },
  ]);

  const labels = result.map((item) => {
    if (labelType === "day") {
      return `${item._id.day}/${item._id.month}`;
    }

    if (labelType === "month") {
      return new Date(item._id.year, item._id.month - 1).toLocaleString(
        "default",
        {
          month: "short",
        },
      );
    }

    return `${item._id.year}`;
  });

  const values = result.map((item) => item.totalSales);

  return {
    labels,

    datasets: [
      {
        label: "Sales",

        data: values,
      },
    ],
  };
};

export default salechartreport;
