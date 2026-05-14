import React, { useEffect, useRef, useState } from "react";
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
  const [chartData, setChartData] = useState([]);

  const [filters, setFilters] = useState({
    clientid: "",
    startdate: "",
    enddate: "",
  });

  const branchid = useStore((state) => state.branchid);

  // prevent multiple initial loads
  const initialLoaded = useRef(false);

  const loadDashboard = async () => {
    Swal.fire({
      title: "Loading Dashboard...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const params = {
        ...filters,
      };

      console.log(params);

      const { data } = await api.get("/getdashboarddata", {
        params,
      });

      // setCardData(data.cards || []);
      // setChartData(data.charts || []);

      Swal.close();
    } catch (err) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Failed to load dashboard",
        text: "Unexpected error occurred while fetching dashboard data.",
      });
    }
  };

  // auto load only once after filters are ready
  useEffect(() => {
    if (
      !initialLoaded.current &&
      filters.clientid &&
      filters.startdate &&
      filters.enddate
    ) {
      initialLoaded.current = true;
      loadDashboard();
    }
  }, [filters]);

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
            setFilters((p) => ({
              ...p,
              clientid: id,
            }))
          }
        />

        <DurationSelector
          onChangeDuration={(startdate, enddate) =>
            setFilters((p) => ({
              ...p,
              startdate,
              enddate,
            }))
          }
        />

        {/* ONLY button click after first load */}
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
