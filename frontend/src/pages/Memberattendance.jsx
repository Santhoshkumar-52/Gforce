import { useContext, useState } from "react";
import "../styles/mattendance.css";
import Swal from "sweetalert2";
import CommonValueContext from "../layouts/CommonvalueContext.jsx";

import { Modal, Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";

export default function Memberattendance() {
  const { baseUrl, branchid } = useContext(CommonValueContext);

  const [memberId, setMemberId] = useState("");
  const [open, setOpen] = useState(false);

  // Dummy member data (replace with API later)
  const [memberData, setMemberData] = useState({
    name: "John Doe",
    id: "M123",
    age: 25,
    plan: "Premium",
    phone: "9876543210",
    image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=500",
  });

  // Dummy attendance table
  const attendanceData = [
    { date: "2026-02-20", time: "07:10 AM", status: "IN" },
    { date: "2026-02-19", time: "07:05 AM", status: "IN" },
    { date: "2026-02-18", time: "06:55 AM", status: "OUT" },
    { date: "2026-02-17", time: "07:20 AM", status: "IN" },
    { date: "2026-02-16", time: "07:15 AM", status: "OUT" },
  ];

  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "time", header: "Time" },
    { accessorKey: "status", header: "Status" },
  ];

  const validateInput = () => {
    if (!memberId) {
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

const handleCheckOut = () => {
  if (!validateInput()){
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: "Please enter Member ID",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const currentTime = new Date().toLocaleTimeString();

  Swal.fire({
    icon: "success",
    title: "Checked Out",
    html: `
      <b>${memberData.name}</b><br/>
      Time: ${currentTime}
    `,
    confirmButtonText: "OK",
  });

  setMemberId("");
};
const handleCheckIn = () => {
  if (!validateInput()){
     return Swal.fire({
       toast: true,
       position: "top-end",
       icon: "warning",
       title: "Please enter Member ID",
       showConfirmButton: false,
       timer: 2000,
       timerProgressBar: true,
     });
  };

  // Later → API call
  setMemberData((prev) => ({ ...prev, id: memberId }));

  setOpen(true);

  setTimeout(() => {
    handleClose();
  }, 20000);
};

  const handleClose = () => {
    setOpen(false);
    setMemberId("");
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
        <h2 className="text-2xl font-bold text-white mb-6">
          MAESTRO Fitness Studio
        </h2>

        <input
          type="text"
          placeholder="Enter Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full p-3 rounded-lg mb-4 outline-none input-style"
        />

        <div className="flex gap-3">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 rounded-lg font-semibold primary-btn cursor-pointer transition-transform hover:scale-105"
          >
            Check IN
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 rounded-lg font-semibold bg-red-500 text-white cursor-pointer transition-transform hover:scale-105"
          >
            Check OUT
          </button>
        </div>
      </div>

      {/* FULL SCREEN MODAL */}
      <Modal open={open}>
        <Box
          className="w-full h-full p-6 flex flex-col gap-6"
          sx={{
            backdropFilter: "blur(10px)",
          }}
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-6 text-white text-2xl z-50"
          >
            ✕
          </button>

          {/* TOP SECTION */}
          <div className="glass-right rounded-2xl p-6 flex gap-6 h-[40%]">
            {/* LEFT IMAGE */}
            <div className="w-[40%] h-full">
              <img
                src={memberData.image}
                alt="member"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* RIGHT DETAILS */}
            <div className="text-white flex flex-col justify-center space-y-3">
              <h2 className="text-2xl font-bold">{memberData.name}</h2>
              <p>ID: {memberData.id}</p>
              <p>Age: {memberData.age}</p>
              <p>Plan: {memberData.plan}</p>
              <p>Phone: {memberData.phone}</p>
            </div>
          </div>

          {/* BOTTOM SECTION (TABLE) */}
          <div className="glass-right rounded-2xl p-4 h-[60%] overflow-auto">
            <MaterialReactTable
              columns={columns}
              data={attendanceData}
              enableTopToolbar={false}
              enableBottomToolbar={false}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
