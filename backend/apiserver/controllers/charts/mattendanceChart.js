import mongoose from "mongoose";
import AttendanceLog from "../../model/memberattendance.js";

const mattendanceChart = async ({ branchid, startdate, enddate }) => {
  const start = new Date(startdate);

  const end = new Date(enddate);
  end.setHours(23, 59, 59, 999);

  // difference in days
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // dynamic grouping
  let groupId = {
    year: {
      $year: "$checkIn",
    },

    month: {
      $month: "$checkIn",
    },
  };

  let labelType = "month";

  // short range -> daily
  if (diffDays <= 14) {
    groupId = {
      year: {
        $year: "$checkIn",
      },

      month: {
        $month: "$checkIn",
      },

      day: {
        $dayOfMonth: "$checkIn",
      },
    };

    labelType = "day";
  }

  // large range -> yearly
  else if (diffDays > 730) {
    groupId = {
      year: {
        $year: "$checkIn",
      },
    };

    labelType = "year";
  }

  const result = await AttendanceLog.aggregate([
    {
      $match: {
        branchId: new mongoose.Types.ObjectId(branchid),

        checkIn: {
          $gte: start,
          $lte: end,
        },
      },
    },

    {
      $group: {
        _id: groupId,

        totalAttendance: {
          $sum: 1,
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

  // labels
  const labels = result.map((item) => {
    // daily
    if (labelType === "day") {
      return `${item._id.day}/${item._id.month}`;
    }

    // monthly
    if (labelType === "month") {
      return new Date(item._id.year, item._id.month - 1).toLocaleString(
        "default",
        {
          month: "short",
        },
      );
    }

    // yearly
    return `${item._id.year}`;
  });

  // values
  const values = result.map((item) => item.totalAttendance);

  return {
    labels,

    datasets: [
      {
        label: "Attendance",

        data: values,
      },
    ],
  };
};

export default mattendanceChart;
