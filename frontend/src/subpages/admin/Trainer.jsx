import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import "../../styles/admin.css";
import adminBg from "../../assets/admin.png";
import CommonValueContext from "../../layouts/CommonvalueContext.jsx";
import Swal from "sweetalert2";
import ReusableTable from "../../components/ReusableTable.jsx";
import { Modal, Box } from "@mui/material";
import { MdEdit } from "react-icons/md";
import api from "../../services/apiService.js";

const initialForm = {
  staffId: "",
  fullName: "",
  groupId: "",
  mobile: "",
  activeStatus: true,
};

const Trainers = () => {
  const { branchid, getGroupIds, groupid } =
    useContext(CommonValueContext);

  const [trainers, setTrainers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(initialForm);

  // ✅ Fetch Trainers
  const getTrainer = useCallback(async () => {
    try {
      Swal.fire({
        text: "Fetching Trainers...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const { data } = await api.get("/staff", {
        params: { branchid },
      });

      setTrainers(data.staffDetails || []);
      Swal.close();
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        text: error.response?.data?.text || "Something went wrong",
      });
    }
  }, [ branchid]);

  useEffect(() => {
    getTrainer();
    getGroupIds();
  }, [getTrainer, getGroupIds]);

  // ✅ Handle Input Change (optimized)
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "activeStatus"
          ? value === "true" // convert string → boolean
          : value,
    }));
  }, []);

  // ✅ Open Add Modal
  const handleAdd = useCallback(() => {
    setForm(initialForm);
    setIsEdit(false);
    setOpen(true);
  }, []);

  // ✅ Open Edit Modal
  const handleEdit = useCallback((data) => {
    setForm({
      ...data,
      groupId: data.groupDetails?.[0]?._id || data.groupId,
    });
    setIsEdit(true);
    setOpen(true);
  }, []);

  // Save Staff
  const saveStaff = useCallback(() => {
    if (!form.staffId || !form.fullName || !form.mobile) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Save this Staff?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, save",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            ...form,
            groupId: form.groupId || groupid?.[0]?._id, // fallback to first group if not selected
            branchId: branchid,
          };

          const response = await api.post("/staff/add", payload);

          Swal.fire({
            icon: response.data.status,
            text: response.data.text || "Staff added successfully",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          setOpen(false);

          setForm({
            staffId: "",
            fullName: "",
            mobile: "",
            groupId: "",
            activeStatus: true,
          });

          await getTrainer();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, getTrainer, branchid]);

  // Update Staff
  const updateStaff = useCallback(() => {
    if (!form.staffId || !form.fullName || !form.mobile) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Update this Staff?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post("/staff/update", form);

          Swal.fire({
            icon: response.data.status,
            text: response.data.text || "Staff updated successfully",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          setOpen(false);
          getTrainer();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, getTrainer]);

  // Memoized Columns (BIG performance win)
  const columns = useMemo(
    () => [
      {
        header: "Action",
        Cell: ({ row }) => (
          <button
            onClick={() => handleEdit(row.original)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            <MdEdit />
          </button>
        ),
      },
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
    ],
    [handleEdit],
  );

  return (
    <div
      className="bg-wrapper p-8"
      style={{ backgroundImage: `url(${adminBg})` }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Trainer Management</h2>
        <p style={{ color: "var(--text-light)" }}>
          Manage All Your Trainers Efficiently
        </p>
      </div>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="w-full mb-6 py-3 rounded-xl font-semibold primary-btn"
      >
        Add New Trainer
      </button>

      {/* Table */}
      <div className="glass-card p-4">
        <ReusableTable columns={columns} data={trainers} />
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[600px] lg:w-[780px] rounded-xl bg-white shadow-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? "Edit Staff" : "Add Staff"}
          </h2>

          <div className="grid md:grid-cols-2 gap-3">
            <input
              name="staffId"
              value={form.staffId}
              onChange={handleChange}
              placeholder="Staff ID"
              className="border p-2 rounded"
            />

            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Staff Name"
              className="border p-2 rounded"
            />

            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="border p-2 rounded"
            />

            <select
              name="groupId"
              value={form.groupId}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              {groupid?.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.groupName}
                </option>
              ))}
            </select>

            <select
              name="activeStatus"
              value={form.activeStatus.toString()}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <button
            onClick={isEdit ? updateStaff : saveStaff}
            className="w-full mt-6 py-3 rounded-xl primary-btn"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default Trainers;
