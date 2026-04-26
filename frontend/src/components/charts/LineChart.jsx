import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

/**
 * Reusable LineChart component
 *
 * Props:
 * - labels: Array of labels for X-axis
 * - datasets: Array of dataset objects for the chart
 * - title: Optional chart title
 */
const LineChart = ({ labels, datasets, title = "Line Chart" }) => {
  // Utility to fetch CSS variable for colors
  const getVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name);

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Default sample data if none provided
  const defaultData = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Yearly Sales",
        data: [
          12000, 15000, 13000, 17000, 19000, 22000, 21000, 25000, 24000, 27000,
          30000, 32000,
        ],
        borderColor: getVar("--chart-primary") || "#3b82f6",
        backgroundColor: getVar("--chart-primary") || "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow">
      <div className="h-72">
        <Line
          data={labels && datasets ? { labels, datasets } : defaultData}
          options={options}
        />
      </div>
    </div>
  );
};

export default LineChart;
