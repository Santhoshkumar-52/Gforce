import { useContext, useState, useMemo, useCallback } from "react";
import "../../styles/reports.css";
import api from "../../services/apiService.js";
import reportsBg from "../../assets/reports.png";
import CommonValueContext from "../../layouts/CommonvalueContext.jsx";
import ReusableTable from "../../components/ReusableTable.jsx";
import Clientdropdown from "../../components/Clientdropdown.jsx";
import DurationSelector from "../../components/DurationSelector.jsx";
import LoadButton from "../../components/buttons/LoadButton.jsx";
import Swal from "sweetalert2";

const AttendanceReport = () => {
  const { user, branchid } = useContext(CommonValueContext);

  // State to hold selected branch and duration
  const [filters, setFilters] = useState({
    branchid: branchid,
    startdate: new Date().toISOString().split("T")[0],
    enddate: new Date().toISOString().split("T")[0],
  });
  const [records, setRecords] = useState([]);

  // Callback when branch changes
  const handleBranchChange = (branchid) => {
    setFilters((prev) => ({ ...prev, branchid }));
  };

  // Callback when duration changes
  const handleDurationChange = (startdate, enddate) => {
    setFilters((prev) => ({ ...prev, startdate, enddate }));
  };

  // Load button click
  const handleLoad = useCallback(async () => {
    if (!filters.branchid || !filters.startdate || !filters.enddate) {
      return Swal.fire({
        icon: "info",
        title: "Kindly Select branch",
      });
    }
    try {
      const response = await api.get(
        `/reports/attendance/m_attendance`,
        {
          params: {
            branchid: filters.branchid,
            fromdate: filters.startdate,
            todate: filters.enddate,
          },
        },
      );

      const data = response.data.data;
      setRecords(data);
    } catch (error) {
      console.error("Error loading report:", error);
    }
  }, [filters]);

  const columns = [
    { accessorKey: "memberInfo.customerId", header: "ID", size: 20 },
    { accessorKey: "memberInfo.firstname", header: "Membername", size: 30 },
    {
      accessorKey: "attendanceDate",
      header: "Date",
      size: 90,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        if (!value) return "";
        return new Date(value).toLocaleDateString("en-GB");
        // en-GB → DD/MM/YYYY
      },
    },
    {
      accessorKey: "checkIn",
      header: "Check In",
      size: 20,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        if (!value) return "";
        return new Date(value).toLocaleTimeString("en-IN");
      },
    },
    {
      accessorKey: "checkOut",
      header: "Check Out",
      size: 20,
      Cell: ({ cell }) => {
        const value = cell.getValue();
        if (!value) return "-";
        return new Date(value).toLocaleTimeString("en-IN");
      },
    },
    { accessorKey: "durationMinutes", header: "Duration", size: 10 },
    { accessorKey: "status", header: "Out", size: 10 },
    { accessorKey: "autoEnd", header: "AutoEnd", size: 10 },
    { accessorKey: "source", header: "Source", size: 10 },
  ];
  const handleCheckout = async () => {
    if (!filters.branchid || filters.branchid === "") {
      return Swal.fire({
        icon: "info",
        title: "Kindly Select branch",
      });
    }

    const result = await Swal.fire({
      icon: "question",
      title: "Confirm",
      text: "Auto checkout everyone within the date?",
      input: "text",
      inputPlaceholder: "Enter reason...",
      showCancelButton: true,
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter a reason!";
        }
      },
    });

    if (result.isConfirmed) {
      const reason = result.value;

      try {
        const response = await api.put(
          `/reports/attendance/autoCheckout`,
          {
            branchid: filters.branchid,
            startdate: filters.startdate,
            enddate: filters.enddate,
            reason,
          },
        );
        const data = response.data;

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: data.icon,
          title: data.title,
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (err) {
        const data = err.response.data;
        Swal.fire({
          icon: data.icon,
          title: data.title,
          text: err?.response?.data?.message || "Something went wrong",
        });
      }
    }
  };

  return (
    <div
      className="bg-wrapper p-8"
      style={{ backgroundImage: `url(${reportsBg})` }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Member Attendance</h2>
        <p style={{ color: "var(--text-light)" }}>
          Track member visit history, attendance patterns, and gym activity
        </p>
      </div>

      <section className="my-6 flex gap-4 items-end flex-wrap">
        <Clientdropdown onChangeClient={handleBranchChange} />
        <DurationSelector onChangeDuration={handleDurationChange} />
        <LoadButton onClick={handleLoad} />
        <button
          onClick={handleCheckout}
          className={`cursor-pointer px-4 py-2 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200`}
        >
          AutoCheckout
        </button>
      </section>

      {/* Table */}
      <div className="glass-card p-4">
        <ReusableTable columns={columns} data={records} />
      </div>
    </div>
  );
};

export default AttendanceReport;
