import React, { useContext, useEffect, useRef, useState } from "react";
import "../styles/dashboard.css";
import CommonValueContext from "../layouts/CommonvalueContext";
import {
  MdOutlinePointOfSale,
  MdGroups,
  MdWarningAmber,
  MdEventBusy,
  MdAutorenew,
  MdPersonAddAlt1,
} from "react-icons/md";
import DashboardCharts from "../pageUIBlocks/Dashboardcharts";
import Clientdropdown from "../components/Clientdropdown";
import DurationSelector from "../components/DurationSelector";
import axios from "axios";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { priceformat, baseUrl, branchid } = useContext(CommonValueContext);

  const today = new Date().toISOString().split("T")[0];

  const [data, setData] = useState(() => ({
    branchid: localStorage.getItem("branchid") || "",
    staffId: localStorage.getItem("user") || "",
    fromdate: today,
    todate: today,
  }));

  const [cardData, setCardData] = useState({});

  const dashboardcards = [
    { title: "Total Members", key: "totalmembers", icon: <MdGroups /> },
    { title: "Total Due Members", key: "totaldue", icon: <MdWarningAmber /> },
    {
      title: "Total Expired Members",
      key: "totalexpired",
      icon: <MdEventBusy />,
    },
    { title: "Expiring Members", key: "totalrenewals", icon: <MdAutorenew /> },
    {
      title: "Total Enquiries",
      key: "totalenquiries",
      icon: <MdPersonAddAlt1 />,
    },
  ];

  const handleDurationChange = (fromdate, todate) => {
    setData((prev) => ({ ...prev, fromdate, todate }));
  };

  const handleClientChange = (branchid) => {
    setData((prev) => ({ ...prev, branchid }));
  };

  /* initialize branch + today's date */
  useEffect(() => {
    if (!branchid) return;

    const today = new Date().toISOString().split("T")[0];

    setData((prev) => ({
      branchid,
      fromdate: prev.fromdate || today,
      todate: prev.todate || today,
    }));
  }, [branchid]);

  /* AUTO LOAD when data becomes valid */
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!data.branchid || !data.fromdate || !data.todate) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    loadDashboard().finally(() => {
      loadingRef.current = false;
    });
  }, []);

  const loadDashboard = async () => {
    let isError = false;

    Swal.fire({
      title: "Loading...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const payload = data;

      const [cardRes, chartRes] = await Promise.all([
        axios.post(`${baseUrl}/api/dashboard/cards`, payload),
        axios.post(`${baseUrl}/api/dashboard/charts`, payload),
      ]);
      setCardData(cardRes.data);

      isError = false; // ✅ success → no error
    } catch (err) {
      isError = true;

      Swal.fire({
        icon: "error",
        title: err.response?.data?.error || "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      if (!isError) Swal.close();
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: "var(--bg-page)" }}>
      <h1
        className="text-3xl font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        Dashboard
      </h1>

      <hr className="my-4" style={{ borderColor: "var(--border-default)" }} />

      <div className="flex my-4 justify-start gap-5">
        <Clientdropdown onChangeClient={handleClientChange} />
        <DurationSelector onChangeDuration={handleDurationChange} />

        <button
          onClick={loadDashboard}
          className="px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "var(--chart-primary)" }}
        >
          Load
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards */}
        <div
          className="min-h-30 overflow-y-auto order-1 md:order-2 md:col-span-1 space-y-4 p-4 shadow"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Quick Info (As on Today)
          </h2>

          {dashboardcards.map((record, index) => (
            <div
              key={index}
              className="rounded-lg shadow p-4"
              style={{
                backgroundColor: `var(--card-bg${(index % 5) + 1})`,
                color: "var(--card-text)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p>{record.title}</p>
                  <p className="text-2xl font-semibold">
                    {cardData?.[record.key] || 0}
                  </p>
                </div>
                <div className="text-4xl opacity-80">{record.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div
          className="order-2 md:order-1 md:col-span-2 rounded-lg shadow p-4"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Charts
          </h2>

          <DashboardCharts
            selecteddate={{ fromdate: data.fromdate, todate: data.todate }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
