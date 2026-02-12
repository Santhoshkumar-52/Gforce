import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const DashboardCharts = () => {
  const getVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name);

  /* Plans */
  const planData = {
    labels: ["Monthly", "Quarterly", "Half-Yearly", "Yearly","Monthly", "Quarterly", "Half-Yearly", "Yearly"],
    datasets: [
      {
        data: [120, 90, 60, 40],
        backgroundColor: [
          getVar("--chart-primary"),
          getVar("--chart-secondary"),
          getVar("--chart-accent"),
          getVar("--chart-danger"),
        ],
      },
    ],
  };

  /* Sales Growth */
  const salesData = {
    labels: ["Week1", "Week2", "Week3", "Week4"],
    datasets: [
      {
        label: "Sales",
        data: [20000, 35000, 28000, 42000],
        borderColor: getVar("--chart-primary"),
        backgroundColor: getVar("--chart-primary"),
        tension: 0.4,
      },
    ],
  };

  /* Attendance */
  const attendanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Attendance",
        data: [45, 60, 52, 70, 66, 80, 40],
        backgroundColor: getVar("--chart-secondary"),
      },
    ],
  };
const rightLegendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      align: "center",
      labels: {
        boxWidth: 14,
        padding: 15,
      },
    },
  },
};

const topLegendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

return (
  <div className="flex flex-col space-y-6">
    {/* Sales */}
    <div className="bg-white rounded-2xl p-5 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Sales Growth</h3>
      </div>

      <div className="h-72">
        <Line data={salesData} options={topLegendOptions} />
      </div>
    </div>
    {/* Attendance */}
    <div className="bg-white rounded-2xl p-5 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Daily Attendance</h3>
      </div>

      <div className="h-72">
        <Bar data={attendanceData} options={topLegendOptions} />
      </div>
    </div>
    {/* Plans */}
    <div className="bg-white rounded-2xl p-5 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Most Purchased Plans</h3>
      </div>

      <div className="h-72">
        <Doughnut data={planData} options={rightLegendOptions} />
      </div>
    </div>
  </div>
);
};

export default DashboardCharts;
