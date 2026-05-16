// charts/memberChart.js

import mongoose from "mongoose";
import MemberPlan from "../../model/memberplan.js";

const memberChart = async ({ branchid, startdate, enddate }) => {
  const start = new Date(startdate);

  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  // today range
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [result] = await MemberPlan.aggregate([
    {
      $match: {
        branchId: new mongoose.Types.ObjectId(branchid),

        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },

    {
      $facet: {
        activeMembers: [
          {
            $match: {
              isActive: true,
              isExpired: false,
              cancelled: false,
            },
          },

          {
            $count: "count",
          },
        ],

        inactiveMembers: [
          {
            $match: {
              $or: [
                { isExpired: true },
                { cancelled: true },
                { isActive: false },
              ],
            },
          },

          {
            $count: "count",
          },
        ],

        newMembers: [
          {
            $match: {
              createdAt: {
                $gte: todayStart,
                $lte: todayEnd,
              },
            },
          },

          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  const active = result.activeMembers[0]?.count || 0;

  const inactive = result.inactiveMembers[0]?.count || 0;

  const newMembers = result.newMembers[0]?.count || 0;

  return {
    labels: ["Active", "Inactive", "New Today"],

    datasets: [
      {
        label: "Membership",

        data: [active, inactive, newMembers],
      },
    ],
  };
};

export default memberChart;
