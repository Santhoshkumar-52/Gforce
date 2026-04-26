import React, { useState, useEffect } from "react";
import Dashbg from "../assets/dashboard.png";

import Clientdropdown from "../components/Clientdropdown";
import DurationSelector from "../components/DurationSelector";
import LoadButton from "../components/buttons/LoadButton";

import DashboardCards from "../pageUIBlocks/DashboardCards";
import DashboardCharts from "../pageUIBlocks/DashboardCharts";

import "../styles/dashboard.css";
import useStore from "../store/useStore.js";
import api from "../services/apiService.js";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [cardData, setCardData] = useState([]);
  const [chartData, setCharddata] = useState([]);
  const token = useStore((state) => state.token);

  const loadDashboard = async () => {
    Swal.fire({
      title: "Loading Dashboard...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await api.get("/getdashboarddata");
      setCardData(response.data.cards);
      setCharddata(response.data.charts);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load dashboard",
        text: "Unexpected error occurred while fetching dashboard data.",
      });
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div
      className="bg-wrapper p-6 md:p-8 min-h-screen"
      style={{ backgroundImage: `url(${Dashbg})` }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1 text-gray-300">Manage your system modules</p>
      </div>

      {/* Filters */}
      <section className="flex flex-col lg:flex-row gap-4 mb-6 lg:items-end">
        <Clientdropdown
          onChangeClient={(clientId) =>
            console.log("Selected Client ID:", clientId)
          }
        />
        <DurationSelector />
        <LoadButton onClick={loadDashboard} />
      </section>

      {/* Cards */}
      <section className="mb-6">
        <DashboardCards data={cardData} />
      </section>

      {/* Charts */}
      <section>
        <DashboardCharts data={chartData} />
      </section>
    </div>
  );
};

export default Dashboard;
