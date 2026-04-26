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

const DashboardCharts = () => {
  // 🎨 Same palette as cards
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

  // 📈 Line Chart (Sales - primary)
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Sales",
        data: [120, 190, 300, 250, 400],
        borderColor: themes.primary.main,
        backgroundColor: themes.primary.light,
        fill: true,
        tension: 0.45,
        pointRadius: 4,
        pointBackgroundColor: themes.primary.main,
        borderWidth: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#cbd5f5", font: { size: 11 } },
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5f5", font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#cbd5f5", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  // 🥧 Pie Chart (members)
  const pieData = {
    labels: ["Active", "Expired", "New"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.2)",
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#d1fae5",
          font: { size: 11 },
        },
      },
    },
  };

  // 📊 Bar Chart (revenue - warning/info mix)
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Revenue",
        data: [500, 700, 600, 900],
        backgroundColor: "rgba(59,130,246,0.7)",
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#fde68a", font: { size: 11 } },
      },
    },
    scales: {
      x: {
        ticks: { color: "#fde68a", font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#fde68a", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Line */}
      <div
        className={`p-4 rounded-xl shadow-md border backdrop-blur-md ${themes.primary.card}`}
      >
        <h3 className={`mb-2 text-sm font-semibold ${themes.primary.title}`}>
          Sales Trend
        </h3>
        <div className="relative h-[200px] w-full">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Pie */}
      <div
        className={`p-4 rounded-xl shadow-md border backdrop-blur-md ${themes.success.card}`}
      >
        <h3 className={`mb-2 text-sm font-semibold ${themes.success.title}`}>
          Membership
        </h3>
        <div className="relative h-[200px] w-full">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* Bar */}
      <div
        className={`p-4 rounded-xl shadow-md border backdrop-blur-md ${themes.warning.card} md:col-span-2`}
      >
        <h3 className={`mb-2 text-sm font-semibold ${themes.warning.title}`}>
          Revenue
        </h3>
        <div className="relative h-[220px] w-full">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
