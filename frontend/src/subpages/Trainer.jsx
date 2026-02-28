import { useContext, useEffect, useState } from "react";
import "../styles/admin.css";
import TrainerBg from "../assets/Trainer.png";
import CommonValueContext from "../layouts/CommonvalueContext";
import axios from "axios";
//components
import Swal from "sweetalert2";
import ReusableTable from "../components/ReusableTable.jsx";
import { Modal, Box } from "@mui/material";
//icons
import { MdEdit } from "react-icons/md";

const Trainers = () => {
  const { branchid, baseUrl } = useContext(CommonValueContext);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    getTrainer();
  }, []);

  const getTrainer = async () => {
    try {
      // ✅ Show loader FIRST
      Swal.fire({
        text: "Fetching Trainers. Stay Tuned!",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.get(`${baseUrl}/api/staff`, {
        params: {
          branchid: branchid,
        },
      });

      const data = response.data;
      setTrainers(data.staffDetails); // set trainers from response

      if (data.status === "success") Swal.close(); // ✅ close loader
    } catch (error) {
      Swal.close(); // ✅ always close loader on error

      Swal.fire({
        icon: error.response?.data?.status || "error",
        text: error.response?.data?.text || "Error",
      });
    }
  };
  const handleEdit = (id) => {
    console.log(id);
  };

  const columns = [
    { accessorKey: "staffId", header: "Staff ID" },
    { accessorKey: "fullName", header: "Name" },
    {
      header: "Group",
      Cell: ({ row }) => row.original.groupDetails?.[0]?.groupName || "-",
    },
    { accessorKey: "mobile", header: "Mobile No" },
    {
      accessorKey: "activeStatus",
      header: "Status",
      Cell: ({ cell }) => {
        const value = cell.getValue();

        return (
          <span
            className={`font-semibold ${
              value ? "text-green-600" : "text-red-500"
            }`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Action",
      Cell: ({ row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
        >
          <MdEdit />
        </button>
      ),
    },
  ];

  return (
    <div
      className="bg-wrapper p-8"
      style={{ backgroundImage: `url(${TrainerBg})` }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Trainer Management</h2>
        <p style={{ color: "var(--text-light)" }}>
          Manage All Your Trainers Efficiently
        </p>
      </div>

      {/* Button */}
      <button className="w-full mb-6 py-3 rounded-xl font-semibold primary-btn">
        Add New Trainer
      </button>

      {/* Table */}
      <div className="glass-card p-4">
        <ReusableTable columns={columns} data={trainers} />
      </div>
    </div>
  );
};

export default Trainers;
