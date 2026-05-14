import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "../../styles/admin.css";
import adminBg from "../../assets/admin.png";
import CommonValueContext from "../../layouts/CommonvalueContext";
import Swal from "sweetalert2";
import ReusableTable from "../../components/ReusableTable";
import { Modal, Box } from "@mui/material";
import { MdEdit } from "react-icons/md";
import api from "../../services/apiService";

const initialForm = {
  plan_name: "",
  plan_description: "",
  duration_months: "",
  price: "",
  is_active: true,
};

const Plans = () => {
  const { branchid } = useContext(CommonValueContext);

  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* =========================================================
      FETCH PLANS
  ========================================================= */
  const getPlans = useCallback(async () => {
    try {
      Swal.fire({
        text: "Fetching Plans...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const { data } = await api.get("/plans", {
        params: { branchid },
      });

      setPlans(data.planDetails || []);

      Swal.close();
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        text: error.response?.data?.text || "Something went wrong",
      });
    }
  }, [branchid]);

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  /* =========================================================
      HANDLE CHANGE
  ========================================================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "is_active"
          ? value === "true"
          : name === "duration_months" || name === "price"
            ? Number(value)
            : value,
    }));
  }, []);

  /* =========================================================
      ADD
  ========================================================= */
  const handleAdd = useCallback(() => {
    setForm(initialForm);
    setIsEdit(false);
    setOpen(true);
  }, []);

  /* =========================================================
      EDIT
  ========================================================= */
  const handleEdit = useCallback((data) => {
    setForm({
      _id: data._id,
      plan_name: data.plan_name,
      plan_description: data.plan_description,
      duration_months: data.duration_months,
      price: data.price,
      is_active: data.is_active,
    });

    setIsEdit(true);
    setOpen(true);
  }, []);

  /* =========================================================
      SAVE
  ========================================================= */
  const savePlan = useCallback(() => {
    if (!form.plan_name || !form.duration_months || !form.price) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this plan?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            ...form,
            branchId: branchid,
          };

          const response = await api.post("/plans/add", payload);

          Swal.fire({
            icon: response.data.status,
            text: response.data.text,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });

          setOpen(false);
          setForm(initialForm);

          await getPlans();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, branchid, getPlans]);

  /* =========================================================
      UPDATE
  ========================================================= */
  const updatePlan = useCallback(() => {
    if (!form.plan_name || !form.duration_months || !form.price) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post("/plans/update", form);

          Swal.fire({
            icon: response.data.status,
            text: response.data.text,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });

          setOpen(false);

          await getPlans();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, getPlans]);

  /* =========================================================
      TABLE COLUMNS
  ========================================================= */
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

      {
        accessorKey: "plan_name",
        header: "Plan Name",
      },

      {
        accessorKey: "plan_description",
        header: "Description",
      },

      {
        accessorKey: "duration_months",
        header: "Duration",
        Cell: ({ cell }) => `${cell.getValue()} Month(s)`,
      },

      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ cell }) => `₹ ${cell.getValue()}`,
      },

      {
        accessorKey: "is_active",
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
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Plan Management</h2>

        <p style={{ color: "var(--text-light)" }}>
          Manage all membership plans
        </p>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={handleAdd}
        className="w-full mb-6 py-3 rounded-xl font-semibold primary-btn"
      >
        Add New Plan
      </button>

      {/* TABLE */}
      <div className="glass-card p-4">
        <ReusableTable columns={columns} data={plans} />
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[600px] lg:w-[750px] rounded-xl bg-white shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-5">
            {isEdit ? "Edit Plan" : "Add Plan"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="plan_name"
              value={form.plan_name}
              onChange={handleChange}
              placeholder="Plan Name"
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="duration_months"
              value={form.duration_months}
              onChange={handleChange}
              placeholder="Duration In Months"
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-3 rounded-lg"
            />

            <select
              name="is_active"
              value={form.is_active.toString()}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <textarea
              name="plan_description"
              value={form.plan_description}
              onChange={handleChange}
              placeholder="Plan Description"
              rows={4}
              className="border p-3 rounded-lg md:col-span-2"
            />
          </div>

          <button
            onClick={isEdit ? updatePlan : savePlan}
            className="w-full mt-6 py-3 rounded-xl primary-btn"
          >
            {isEdit ? "Update Plan" : "Save Plan"}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default Plans;
