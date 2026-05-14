import React from "react";
import { Line, Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
);

const DashboardCharts = ({ data = {} }) => {
  const themes = {
    primary: {
      main: "#6366f1",
      light: "rgba(99,102,241,0.12)",
      card: "bg-indigo-500/10 border-indigo-400/20",
      title: "text-indigo-200",
    },

    success: {
      main: "#22c55e",
      light: "rgba(34,197,94,0.12)",
      card: "bg-emerald-500/10 border-emerald-400/20",
      title: "text-emerald-200",
    },

    warning: {
      main: "#f59e0b",
      light: "rgba(245,158,11,0.12)",
      card: "bg-amber-500/10 border-amber-400/20",
      title: "text-amber-200",
    },
  };

  // reusable options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#cbd5f5",
          font: {
            size: 11,
          },
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#cbd5f5",
          font: {
            size: 11,
          },
        },

        grid: {
          display: false,
        },
      },

      y: {
        ticks: {
          color: "#cbd5f5",
          font: {
            size: 11,
          },
        },

        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  // backend charts
  const salesChart = data.salereport || {
    labels: [],
    datasets: [],
  };

  const memberChart = data.memberChart || {
    labels: [],
    datasets: [],
  };

  const revenueChart = data.revenueChart || {
    labels: [],
    datasets: [],
  };

  // styling datasets dynamically
  const styledSalesChart = {
    ...salesChart,

    datasets:
      salesChart.datasets?.map((ds) => ({
        ...ds,

        borderColor: themes.primary.main,

        backgroundColor: themes.primary.light,

        fill: true,

        tension: 0.45,

        pointRadius: 4,

        pointBackgroundColor: themes.primary.main,

        borderWidth: 3,
      })) || [],
  };

  const styledRevenueChart = {
    ...revenueChart,

    datasets:
      revenueChart.datasets?.map((ds) => ({
        ...ds,

        backgroundColor: "rgba(59,130,246,0.7)",

        borderRadius: 8,

        barThickness: 20,
      })) || [],
  };

  const styledMemberChart = {
    ...memberChart,

    datasets:
      memberChart.datasets?.map((ds) => ({
        ...ds,

        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#f59e0b",
          "#3b82f6",
          "#8b5cf6",
        ],

        borderWidth: 2,

        borderColor: "rgba(0,0,0,0.2)",
      })) || [],
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Sales Line */}
      <div
        className={`p-4 rounded-xl shadow-md border backdrop-blur-md ${themes.primary.card}`}
      >
        <h3 className={`mb-2 text-sm font-semibold ${themes.primary.title}`}>
          Sales Trend
        </h3>

        <div className="relative h-[200px] w-full">
          <Line data={styledSalesChart} options={commonOptions} />
        </div>
      </div>

      {/* Membership Pie */}
      <div
        className={`p-4 rounded-xl shadow-md border backdrop-blur-md ${themes.success.card}`}
      >
        <h3 className={`mb-2 text-sm font-semibold ${themes.success.title}`}>
          Membership
        </h3>

        <div className="relative h-[200px] w-full">
          <Pie
            data={styledMemberChart}
            options={{
              responsive: true,
              maintainAspectRatio: false,

              plugins: {
                legend: {
                  position: "bottom",

                  labels: {
                    color: "#d1fae5",
                    font: {
                      size: 11,
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Revenue Bar */}
      <div
        className={`p-4 rounded-xl shadow-md border backdrop-blur-md ${themes.warning.card} md:col-span-2`}
      >
        <h3 className={`mb-2 text-sm font-semibold ${themes.warning.title}`}>
          Revenue
        </h3>

        <div className="relative h-[220px] w-full">
          <Bar data={styledRevenueChart} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
