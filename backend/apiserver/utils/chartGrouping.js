// utils/chartGrouping.js

export const getGroupingType = (startdate, enddate) => {
  const start = new Date(startdate);
  const end = new Date(enddate);

  const diffDays = (end - start) / (1000 * 60 * 60 * 24);

  if (diffDays <= 14) return "day";

  if (diffDays <= 90) return "week";

  if (diffDays <= 730) return "month";

  return "year";
};

export const getGroupStage = (groupType) => {
  switch (groupType) {
    case "day":
      return {
        label: {
          $dateToString: {
            format: "%d %b",
            date: "$saleDate",
          },
        },
      };

    case "month":
      return {
        label: {
          $dateToString: {
            format: "%b %Y",
            date: "$saleDate",
          },
        },
      };

    case "year":
      return {
        label: {
          $dateToString: {
            format: "%Y",
            date: "$saleDate",
          },
        },
      };

    case "week":
      return {
        year: { $year: "$saleDate" },
        week: { $week: "$saleDate" },
      };

    default:
      return {
        label: {
          $dateToString: {
            format: "%d %b",
            date: "$saleDate",
          },
        },
      };
  }
};

export const normalizeChartData = (
  rows,
  groupType,
  valueField,
  datasetLabel,
) => {
  return {
    labels: rows.map((x) => {
      if (groupType === "week") {
        return `Week ${x._id.week}`;
      }

      return x._id.label;
    }),

    datasets: [
      {
        label: datasetLabel,
        data: rows.map((x) => x[valueField]),
      },
    ],
  };
};
