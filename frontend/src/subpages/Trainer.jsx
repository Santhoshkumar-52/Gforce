import { useContext, useEffect, useState } from "react";
import "../styles/admin.css";
import ReusableTable from "../components/ReusableTable.jsx";
import TrainerBg from "../assets/Trainer.png";
import CommonValueContext from "../layouts/CommonvalueContext";
import axios from "axios";
import Swal from "sweetalert2";

const Trainers = () => {
  const { branchid, baseUrl } = useContext(CommonValueContext);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTrainer();
  }, []);

  const getTrainer = async () => {
    try {
      const response = await axios.get(`${baseUrl}/trainer/getTrainer`, {
        params: {
          branchid: branchid,
        },
      });
      const data = response.data;
    } catch (error) {
      Swal.fire({
        icon: error.response?.status || "error",
        title: error.response?.title || "Error",
        text:
          error.response?.message ||
          "An error occurred while fetching trainers.",
      });
    }
  };

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "staffid", header: "Staff ID" },
    { accessorKey: "phone", header: "Mobile No" },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => (
        <span
          className={`font-semibold ${
            cell.getValue() === "Active" ? "text-green-600" : "text-red-500"
          }`}
        >
          {cell.getValue()}
        </span>
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
        <ReusableTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default Trainers;
