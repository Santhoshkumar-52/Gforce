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
  gstname: "",
  value: "",
  is_active: true,
};

const GST = () => {
  const { branchid } = useContext(CommonValueContext);

  const [gstList, setGstList] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* =========================================================
      FETCH GST
  ========================================================= */
  const getGST = useCallback(async () => {
    try {
      Swal.fire({
        text: "Fetching GST...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const { data } = await api.get("/gst", {
        params: { branchid },
      });

      setGstList(data.gstDetails || []);

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
    getGST();
  }, [getGST]);

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
          : name === "value"
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
      gstname: data.gstname,
      value: data.value,
      is_active: data.is_active,
    });

    setIsEdit(true);
    setOpen(true);
  }, []);

  /* =========================================================
      SAVE
  ========================================================= */
  const saveGST = useCallback(() => {
    if (!form.gstname || !form.value) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this GST?",
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

          const response = await api.post("/gst/add", payload);

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

          await getGST();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, branchid, getGST]);

  /* =========================================================
      UPDATE
  ========================================================= */
  const updateGST = useCallback(() => {
    if (!form.gstname || !form.value) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this GST?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post("/gst/update", form);

          Swal.fire({
            icon: response.data.status,
            text: response.data.text,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });

          setOpen(false);

          await getGST();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, getGST]);

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
        accessorKey: "gstname",
        header: "GST Name",
      },

      {
        accessorKey: "value",
        header: "GST %",
        Cell: ({ cell }) => `${cell.getValue()} %`,
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
        <h2 className="text-3xl font-bold text-white">GST Management</h2>

        <p style={{ color: "var(--text-light)" }}>Manage GST percentages</p>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={handleAdd}
        className="w-full mb-6 py-3 rounded-xl font-semibold primary-btn"
      >
        Add GST
      </button>

      {/* TABLE */}
      <div className="glass-card p-4">
        <ReusableTable columns={columns} data={gstList} />
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[550px] rounded-xl bg-white shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-5">
            {isEdit ? "Edit GST" : "Add GST"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="gstname"
              value={form.gstname}
              onChange={handleChange}
              placeholder="GST Name"
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              placeholder="GST Percentage"
              className="border p-3 rounded-lg"
            />

            <select
              name="is_active"
              value={form.is_active.toString()}
              onChange={handleChange}
              className="border p-3 rounded-lg md:col-span-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <button
            onClick={isEdit ? updateGST : saveGST}
            className="w-full mt-6 py-3 rounded-xl primary-btn"
          >
            {isEdit ? "Update GST" : "Save GST"}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default GST;
