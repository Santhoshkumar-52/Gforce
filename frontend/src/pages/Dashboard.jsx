import React, { useEffect, useRef, useState, useCallback } from "react";
import Swal from "sweetalert2";

import Dashbg from "../assets/dashboard.png";

import Clientdropdown from "../components/Clientdropdown";
import DurationSelector from "../components/DurationSelector";
import LoadButton from "../components/buttons/LoadButton";

import DashboardCards from "../pageUIBlocks/DashboardCards";
import DashboardCharts from "../pageUIBlocks/DashboardCharts";

import "../styles/dashboard.css";

import api from "../services/apiService.js";
import useStore from "../store/useStore.js";

const Dashboard = () => {
  const branchid = useStore((state) => state.branchid);

  const initialLoaded = useRef(false);

  const [dashboardData, setDashboardData] = useState({
    cards: [],
    charts: {},
  });

  const [filters, setFilters] = useState({
    branchid: "",
    startdate: "",
    enddate: "",
  });

  const updateFilters = useCallback((newValues) => {
    setFilters((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      Swal.fire({
        title: "Loading Dashboard...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const { data } = await api.get("/getdashboarddata", {
        params: filters,
      });

      setDashboardData({
        cards: data.cards || [],
        charts: data.charts || {},
      });

      Swal.close();
    } catch (err) {
      console.error("[Dashboard Load Error]", err);

      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Failed to load dashboard",
        text: "Unexpected error occurred while fetching dashboard data.",
      });
    }
  }, [filters]);

  useEffect(() => {
    const ready = filters.branchid && filters.startdate && filters.enddate;

    if (!initialLoaded.current && ready) {
      initialLoaded.current = true;
      loadDashboard();
    }
  }, [filters, loadDashboard]);

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
          onChangeClient={(id) =>
            updateFilters({
              branchid: id,
            })
          }
        />

        <DurationSelector
          onChangeDuration={(startdate, enddate) =>
            updateFilters({
              startdate,
              enddate,
            })
          }
        />

        <LoadButton onClick={loadDashboard} />
      </section>

      {/* Cards */}
      <section className="mb-6">
        <DashboardCards data={dashboardData.cards} />
      </section>

      {/* Charts */}
      <section>
        <DashboardCharts data={dashboardData.charts} />
      </section>
    </div>
  );
};

export default Dashboard;
