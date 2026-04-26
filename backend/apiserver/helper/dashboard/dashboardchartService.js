const mongoose = require("mongoose");
const Sale = mongoose.model("salemaster");

const getYearlySalesChart = async ({ branchid, fromdate, todate }) => {
  const result = await Sale.aggregate([
    {
      $match: {
        branchId: new mongoose.Types.ObjectId(branchid),
        saleDate: {
          $gte: new Date(fromdate),
          $lte: new Date(todate),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$saleDate" } },
        totalAmount: { $sum: "$paidAmount" },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
  ]);

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const map = {};
  result.forEach((r) => {
    map[r._id.month] = r.totalAmount;
  });

  const data = MONTHS.map((_, i) => map[i + 1] || 0);

  return {
    id: "sales",
    type: "line",
    title: "Yearly Sales",
    data: {
      labels: MONTHS,
      datasets: [
        {
          label: "Sales",
          data,
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
  };
};

module.exports = { getYearlySalesChart };
