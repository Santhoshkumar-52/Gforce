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
  discountname: "",
  activestatus: true,
};

const Discount = () => {
  const { branchid } = useContext(CommonValueContext);

  const [discountList, setDiscountList] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* =========================================================
      FETCH DISCOUNTS
  ========================================================= */
  const getDiscounts = useCallback(async () => {
    try {
      Swal.fire({
        text: "Fetching Discounts...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const { data } = await api.get("/discount", {
        params: { branchid },
      });

      setDiscountList(data.discountDetails || []);

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
    getDiscounts();
  }, [getDiscounts]);

  /* =========================================================
      HANDLE CHANGE
  ========================================================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "activestatus" ? value === "true" : value,
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
      discountname: data.discountname,
      activestatus: data.activestatus,
    });

    setIsEdit(true);
    setOpen(true);
  }, []);

  /* =========================================================
      SAVE
  ========================================================= */
  const saveDiscount = useCallback(() => {
    if (!form.discountname) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this discount?",
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

          const response = await api.post("/discount/add", payload);

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

          await getDiscounts();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, branchid, getDiscounts]);

  /* =========================================================
      UPDATE
  ========================================================= */
  const updateDiscount = useCallback(() => {
    if (!form.discountname) {
      return Swal.fire({
        icon: "warning",
        text: "Please fill all required fields",
      });
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this discount?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.post("/discount/update", form);

          Swal.fire({
            icon: response.data.status,
            text: response.data.text,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });

          setOpen(false);

          await getDiscounts();
        } catch (error) {
          Swal.fire({
            icon: "error",
            text: error.response?.data?.text || "Something went wrong",
          });
        }
      }
    });
  }, [form, getDiscounts]);

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
        accessorKey: "discountname",
        header: "Discount Name",
      },

      {
        accessorKey: "activestatus",
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
        <h2 className="text-3xl font-bold text-white">Discount Management</h2>

        <p style={{ color: "var(--text-light)" }}>Manage all discounts</p>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={handleAdd}
        className="w-full mb-6 py-3 rounded-xl font-semibold primary-btn"
      >
        Add Discount
      </button>

      {/* TABLE */}
      <div className="glass-card p-4">
        <ReusableTable columns={columns} data={discountList} />
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[500px] rounded-xl bg-white shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-5">
            {isEdit ? "Edit Discount" : "Add Discount"}
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              name="discountname"
              value={form.discountname}
              onChange={handleChange}
              placeholder="Discount Name"
              className="border p-3 rounded-lg"
            />

            <select
              name="activestatus"
              value={form.activestatus.toString()}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <button
            onClick={isEdit ? updateDiscount : saveDiscount}
            className="w-full mt-6 py-3 rounded-xl primary-btn"
          >
            {isEdit ? "Update Discount" : "Save Discount"}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default Discount;
