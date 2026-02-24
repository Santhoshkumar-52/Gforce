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
    attendanceData: [],
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
    { accessorKey: "time", header: "Time" },
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

    // TODO: Replace with API call
    try {
      const memberdata = await axios.post(`${baseUrl}/api/attendance/checkin`, {
        branchid,
        memberid: state.memberId,
      });

      const result = memberdata.data;
      if (result.status === "info") {
        return Swal.fire({
          icon: "info",
          text: result.message,
          confirmButtonText: "OK",
        });
      }

      setState((prev) => ({
        ...prev,
        memberData: result.result[0],
        open: true,
      }));
    } catch (err) {
      console.error("Error during check-in:", err);
      Swal.fire({
        icon: "error",
        title: "Check-in Failed",
        text: "An error occurred while checking in. Please try again.",
      });
      return;
    }
    // setTimeout(handleClose, 20000);
  };

  // 🔹 Check OUT
  const handleCheckOut = () => {
    if (!validateInput()) return;

    const currentTime = new Date().toLocaleTimeString();

    Swal.fire({
      icon: "success",
      title: "Checked Out",
      html: `
        <b>${state.memberData?.name || "Member"}</b><br/>
        Time: ${currentTime}
      `,
    });

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
          className="w-full h-full p-6 flex flex-col  gap-6"
          sx={{ backdropFilter: "blur(10px)" }}
        >
          {/* CLOSE */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-6 text-white text-2xl"
          >
            ✕
          </button>

          {/* TOP */}
          <div className="glass-right rounded-2xl p-6 flex flex-col sm:flex-row  gap-6 h-[40%]">
            <div className="w-[20%]">
              <img
                src={`/memberImages/${state.memberData?.memberImage}`}
                alt="Profile Picture"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <div className="text-white flex flex-col justify-center space-y-3">
              <h2 className="text-2xl font-bold">
                {[state.memberData?.firstname, state.memberData?.lastname].join(
                  " ",
                )}
              </h2>
              <section>
                <p>ID: {state.memberData?.customerId}</p>
                <p>Plan: {state.memberData?.planDetails.plan_name}</p>
                <p>Phone: {state.memberData?.mobile}</p>
                <p>Expiring On: {state.memberData?.latestPlan.expiryDate}</p>
              </section>
            </div>
          </div>

          {/* TABLE */}
          <div className="glass-right rounded-2xl p-4 h-[60%] overflow-auto">
            <MaterialReactTable
              columns={columns}
              data={state.attendanceData}
              enableTopToolbar={false}
              enableBottomToolbar={false}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
