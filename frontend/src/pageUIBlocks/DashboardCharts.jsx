import React from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";

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

const DashboardCharts = ({ data }) => {
  // charts from backend
  const salesChart = data?.salereport || {
    labels: [],
    datasets: [],
  };

  const membershipChart = data?.membershipcount || {
    labels: [],
    datasets: [],
  };
  const attendanceChart = data?.mattendance || {
    labels: [],
    datasets: [],
  };

  // sales chart styles
  const salesData = {
    ...salesChart,

    datasets: salesChart.datasets.map((item) => ({
      ...item,

      borderColor: "#6366f1",

      backgroundColor: "rgba(99,102,241,0.12)",

      fill: true,

      tension: 0.4,

      pointRadius: 4,

      borderWidth: 3,
    })),
  };

  // membership chart styles
  const membershipData = {
    ...membershipChart,

    datasets: membershipChart.datasets.map((item) => ({
      ...item,

      backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],

      borderWidth: 2,
    })),
  };

  // for attendance
  const attendanceData = {
    ...attendanceChart,

    datasets: attendanceChart.datasets.map((item) => ({
      ...item,

      backgroundColor: "rgba(34,197,94,0.6)",

      borderRadius: 6,

      borderColor: "#22c55e",

      borderWidth: 1,
    })),
  };

  // common chart options
  const lineOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#cbd5f5",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#cbd5f5",
        },

        grid: {
          display: false,
        },
      },

      y: {
        ticks: {
          color: "#cbd5f5",
        },

        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#d1fae5",
        },
      },
    },
  };
  const barOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          color: "#bbf7d0",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#bbf7d0",
        },

        grid: {
          display: false,
        },
      },

      y: {
        ticks: {
          color: "#bbf7d0",
        },

        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      {/* Sales Chart */}
      <div className="p-4 rounded-xl border border-indigo-400/20 bg-indigo-500/10 backdrop-blur-md">
        <h3 className="mb-3 text-sm font-semibold text-indigo-200">
          Sales Trend
        </h3>

        <div className="h-[260px]">
          <Line data={salesData} options={lineOptions} />
        </div>
      </div>

      {/* Membership Chart */}
      <div className="p-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 backdrop-blur-md">
        <h3 className="mb-3 text-sm font-semibold text-emerald-200">
          Membership Overview
        </h3>

        <div className="h-[260px]">
          <Doughnut data={membershipData} options={doughnutOptions} />
        </div>
      </div>
      {/* Attendance Chart */}
      <div className="p-4 rounded-xl border border-green-400/20 bg-green-500/10 backdrop-blur-md lg:col-span-2">
        <h3 className="mb-3 text-sm font-semibold text-green-200">
          Attendance Trend
        </h3>

        <div className="h-[260px]">
          <Bar data={attendanceData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
