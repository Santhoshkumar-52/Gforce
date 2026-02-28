import { useContext, useEffect, useRef, useState } from "react";
import "../styles/mattendance.css";
import Swal from "sweetalert2";
import CommonValueContext from "../layouts/CommonvalueContext.jsx";
import { Modal, Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";

export default function Memberattendance() {
  const { getbranchdetails, branchdata, branchid, baseUrl } =
    useContext(CommonValueContext);

  // 🔹 GROUPED STATE (clean)
  const [state, setState] = useState({
    memberId: "",
    memberData: null,
    open: false,
    attendanceData: null, // change to object
    report: null,
    summaryData: null,
  });

  const currentTimeRef = useRef(null);

  // 🔹 Fetch branch details
  useEffect(() => {
    getbranchdetails();
  }, []);

  // 🔹 Live clock (fixed memory leak)
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTimeRef.current) {
        const now = new Date();
        currentTimeRef.current.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      }
    }, 1000);

    return () => clearInterval(interval); // ✅ cleanup
  }, []);

  // 🔹 Table data

  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "checkIn", header: "Check In" },
    { accessorKey: "checkOut", header: "Check Out" },
    { accessorKey: "status", header: "Status" },
  ];

  // 🔹 Input validation
  const validateInput = () => {
    if (!state.memberId) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Please enter Member ID",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }
    return true;
  };

  // 🔹 Check IN
  const handleCheckIn = async () => {
    if (!validateInput()) return;

    try {
      const { data } = await axios.post(`${baseUrl}/api/attendance/checkin`, {
        branchid,
        memberid: state.memberId,
      });

      if (data.status === "info") {
        return Swal.fire({
          icon: "info",
          text: data.message,
          confirmButtonText: "OK",
        });
      }

      setState((prev) => {
        const agg = data.report?.[0] || {};
        const reportRows = agg.report || [];
        const totals = agg.summary?.[0] || {};

        return {
          ...prev,
          memberData: data.member,
          attendanceData: data.attendance,
          summaryData: totals,
          report: reportRows.map((r) => ({
            date: r.date,
            checkIn: r.checkIn
              ? new Date(r.checkIn).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            checkOut: r.checkOut
              ? new Date(r.checkOut).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
            status: r.status,
          })),
          open: true,
        };
      });
      setTimeout(() => {
        handleClose();
      }, 10000);
    } catch (err) {
      console.error("Error during check-in:", err);

      Swal.fire({
        icon: "error",
        title: "Check-in Failed",
        text: "An error occurred while checking in. Please try again.",
      });
    }
  };

  // 🔹 Check OUT
  const handleCheckOut = async () => {
    if (!validateInput()) return;

    try {
      const memberdata = await axios.post(
        `${baseUrl}/api/attendance/checkout`,
        {
          branchid,
          memberid: state.memberId,
        },
      );
      const result = memberdata.data;
      if (result.status === "ok") {
        const minutes = result.data.durationMinutes;
        const hours = (minutes / 60).toFixed(2);

        return Swal.fire({
          icon: "success",
          title: "Check-Out Successful",
          text: `Duration: ${hours} hours`,
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error during check-in:", err);
      Swal.fire({
        icon: "error",
        title: "Check-in Failed",
        text: "An error occurred while checking in. Please try again.",
      });
      return;
    }

    // Swal.fire({
    //   icon: "success",
    //   title: "Checked Out",
    //   html: `
    //     <b>${state.memberData?.name || "Member"}</b><br/>
    //     Time: ${currentTime}
    //   `,
    // });

    setState((prev) => ({ ...prev, memberId: "" }));
  };

  // 🔹 Close modal
  const handleClose = () => {
    setState((prev) => ({
      ...prev,
      open: false,
      memberId: "",
      memberData: null,
      attendanceData: [],
    }));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('https://i.ytimg.com/vi/82ErtoI8uy8/hq720.jpg')",
      }}
    >
      {/* CENTER INPUT */}
      <div className="glass-left p-10 rounded-2xl shadow-xl w-[400px] text-center">
        <div className="h-[200px] flex items-center justify-center rounded-xl overflow-hidden">
          <img
            src={branchdata?.branchImage}
            alt="branch_logo"
            className="h-full w-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">
          {branchdata?.branchname}
        </h2>

        <input
          type="text"
          placeholder="Enter Member ID"
          value={state.memberId}
          onInput={(e) =>
            setState((prev) => ({ ...prev, memberId: e.target.value }))
          }
          className="w-full p-3 rounded-lg mb-4 outline-none input-style"
        />

        <div className="flex gap-3">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 rounded-lg font-semibold primary-btn hover:scale-105"
          >
            Check IN
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 rounded-lg font-semibold bg-red-500 text-white hover:scale-105"
          >
            Check OUT
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal open={state.open}>
        <Box
          className="fixed inset-0 p-4 sm:p-6 flex justify-center items-start overflow-y-auto"
          sx={{ backdropFilter: "blur(10px)" }}
        >
          <div
            className="w-full max-w-7xl 
                    flex flex-col lg:flex-row gap-6"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={handleClose}
              className="fixed top-4 right-6 text-white text-2xl z-50"
            >
              ✕
            </button>

            {/* ================= LEFT SIDE ================= */}
            <div
              className="glass-right rounded-2xl p-6 
                      w-full lg:w-1/3 flex flex-col"
            >
              {/* IMAGE */}
              <div className="flex justify-center">
                <img
                  src={`/memberImages/${state.memberData?.memberImage}`}
                  alt="Profile"
                  className="w-40 h-40 object-contain rounded-xl"
                />
              </div>

              {/* DETAILS */}
              <div className="mt-8 text-white space-y-3">
                <h2 className="text-xl font-bold text-center">
                  {[
                    state.memberData?.firstname,
                    state.memberData?.lastname,
                  ].join(" ")}
                </h2>

                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded text-white text-sm ${
                      state.memberData?.isactive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {state.memberData?.isactive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="pt-4 space-y-2 text-sm">
                  <p>
                    <strong>ID:</strong> {state.memberData?.customerId}
                  </p>
                  <p>
                    <strong>Phone:</strong> {state.memberData?.mobile}
                  </p>
                </div>
              </div>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div
              className="glass-right rounded-2xl p-6 
                      w-full lg:w-2/3 flex flex-col"
            >
              {/* PLAN INFO */}
              <div className="text-white space-y-3 border-b border-white/20 pb-4">
                <span
                  className={`px-3 py-1 rounded text-white text-sm ${
                    state.memberData?.latestPlan.isExpired
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {state.memberData?.latestPlan.isExpired
                    ? "Plan Expired"
                    : "Plan Active"}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mt-4">
                  <div>
                    <p className="font-semibold">Plan</p>
                    <p>{state.memberData?.planDetails.plan_name}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Expiry</p>
                    <p>{state.memberData?.latestPlan.expiryDateFormatted}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Days Remaining</p>
                    <p>{state.memberData?.daysRemaining}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Staff </p>
                    <p>{state.memberData?.staffDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Total Durations </p>
                    <p>{state.summaryData?.totalDuration || 0} minutes</p>
                  </div>
                  <div>
                    <p className="font-semibold">Total CheckIns </p>
                    <p>{state.summaryData?.totalCheckins || 0} minutes</p>
                  </div>
                </div>
              </div>

              {/* TABLE (NO HEIGHT RESTRICTION) */}
              <div
                className="mt-4"
                style={{ height: "20rem", overflow: "auto" }}
              >
                <MaterialReactTable
                  columns={columns}
                  data={state.report || []}
                  enableTopToolbar={false}
                  enableBottomToolbar={false}
                />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
