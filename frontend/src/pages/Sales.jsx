import { useEffect, useState, useMemo, useCallback } from "react";
import { MaterialReactTable } from "material-react-table";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { MdDelete, MdAdd } from "react-icons/md";
import Swal from "sweetalert2";
import "../styles/sales.css";
import useStore from "../store/useStore.js";
import {
  calculateGST,
  calculateDiscount,
} from "../store/calculationFunctions.js";
import axios from "axios";
import SaleSummaryModal from "../pageUIBlocks/SaleSummary.jsx";
import { duration } from "@mui/material";

const Sales = () => {
  // Generate a random sale ID for the bill
  const saleid = useMemo(() => Math.floor(10000 + Math.random() * 90000), []);

  // Modal open/close state
  const [open, changeOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  // Default form values
  const defaultvalues = useMemo(
    () => ({
      memberid: "",
      saledate: new Date().toISOString().split("T")[0],
      billno: "SI/" + saleid,
      duration: 0,
      mobile: "",
      plan: "",
      planname: "",
      staff: "",
      staffname: "",
      discount: "",
      discountamt: "",
      discountfinalamt: 0,
      gst: "0",
      gstid: "0",
      gstpercent: "",
      totalamount: 0,
      baseamount: 0,
      creadtedby: user?.staff?.staffid || 1,
    }),
    [saleid],
  );

  // Zustand store
  const {
    priceformat,
    setdicountids,
    discountids,
    gstvalues,
    setgstids,
    setplanids,
    plans,
    setstaff,
    staffs,
    baseUrl,
    branchid,
  } = useStore();

  const [form, setForm] = useState(defaultvalues);
  const [members, setMembers] = useState([]);

  // Table data
  const [table, setTable] = useState([]);
  // Initialize store data on mount
  useEffect(() => {
    form;
    setdicountids();
    setgstids();
    setplanids();
    setstaff();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.post(`${baseUrl}/api/member/getmembers`, {
          clientid: branchid,
        });

        // assuming API returns array
        setMembers(res.data.records || []);
        // console.log(res.data.records);
      } catch (err) {
        console.error("Failed to load members", err);
      }
    };

    fetchMembers();
  }, []);

  // Form state

  // Compute if discount input should be shown (optimized with useMemo)
  const discountoption = useMemo(
    () => form.discount !== "0" && form.discount !== "",
    [form.discount],
  );

  // -------------------------
  // handleSale: updates form state and calculates GST/Discount/Total
  // -------------------------
  const handleSale = useCallback(
    (e) => {
      const { name, value } = e.target;

      setForm((prev) => {
        let updated = { ...prev, [name]: value };

        // PLAN selection
        if (name === "plan") {
          const selectedOption = e.target.options[e.target.selectedIndex];
          const duration = Number(selectedOption.dataset.duration_months);
          updated.duration = duration;
          const price =
            value === "0" ? 0 : Number(selectedOption.dataset.price);
          updated.baseamount = price;
          updated.planname = value === "0" ? "Unknown" : selectedOption.text;
        }

        // STAFF selection
        if (name === "staff") {
          const selectedOption = e.target.options[e.target.selectedIndex];
          updated.staffname = value === "" ? "Unknown" : selectedOption.text;
        }

        // GST calculation
        if (name === "gstpercent" && updated.baseamount !== 0) {
          if (value === "0") {
            updated.gstpercent = 0; // amount
            updated.gst = 0; // percentage
            updated.gstid = "0"; // selected ID
          } else {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const gstValue = Number(selectedOption.dataset.price);
            const gstAmount = calculateGST(updated.baseamount, gstValue);
            updated.gstpercent = gstAmount; // actual amount
            updated.gst = gstValue; // percentage
            updated.gstid = value; // selected option ID
          }
        }

        // Discount input toggle handled by discountoption (no separate state now)

        // Discount amount calculation
        if (updated.discount && updated.discount !== "0") {
          updated.discountfinalamt = calculateDiscount(
            updated.baseamount,
            updated.discountamt || 0,
            updated.discount,
          );
        } else {
          updated.discountfinalamt = 0;
        }

        // Total amount calculation
        updated.totalamount =
          updated.baseamount + updated.gstpercent - updated.discountfinalamt;

        return updated;
      });
    },
    [form],
  );

  // -------------------------
  // addRecord: validates and adds a record to table
  // -------------------------
  const addRecord = useCallback(() => {
    // Validation
    if (form.totalamount < 0) {
      return Swal.fire({
        title: "Wait",
        text: "Invalid total amount, check the amount again",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });
    }
    if (!form.plan || !form.staff || form.totalamount < 0) {
      Swal.fire({
        title: "Missing Required Fields",
        text: "Plan, Staff & Price are required!",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });
      return;
    }

    if (form.discount && form.discount !== "0" && form.discountamt === "") {
      Swal.fire({
        text: "Invalid Discount Number",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });
      return;
    }

    // Create new record
    const newRecord = {
      duration: form.duration,
      memberid: form.memberid,
      id: Date.now(),
      billno: form.billno,
      plan: form.plan,
      planname: form.planname,
      staff: form.staff,
      staffname: form.staffname,
      baseprice: form.baseamount,
      discounttype: form.discount,
      discount: form.discountfinalamt || 0,
      gst: form.gst || 0,
      gstamount: form.gstpercent || 0,
      total: Math.round(form.totalamount),
      saledate: form.saledate,
    };

    setTable((prev) => [...prev, newRecord]);
    setForm(defaultvalues);
  }, [form]);

  const saveRecord = async () => {
    try {
      const res = await axios.post(`${baseUrl}/api/sales/addsale`, table);
      Swal.fire({
        icon: res.status,
        title: res.title,
        text: res.message,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: err.message,
      });
    }
  };

  // -------------------------
  // deleteRecord: removes record from table
  // -------------------------
  const deleteRecord = useCallback((id) => {
    setTable((prev) => prev.filter((r) => r.id !== id));

    Swal.fire({
      title: "Deleted!",
      text: "Record removed successfully",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });

    console.log(id, "Removed from Cart");
  }, []);

  // -------------------------
  // Table columns (optimized with useMemo)
  // -------------------------
  const columns = useMemo(
    () => [
      { accessorKey: "planname", header: "Plan" },
      { accessorKey: "staffname", header: "Alloted Staff" },
      { accessorKey: "baseprice", header: `Base Price (${priceformat})` },
      { accessorKey: "discount", header: "Discount" },
      {
        header: "GST (%)",
        Cell: ({ row }) => (
          <>
            {row.original.gst}% <br />
            <span className="text-gray-500 text-xs">
              {priceformat} {row.original.gstamount.toFixed(2)}
            </span>
          </>
        ),
      },
      { accessorKey: "total", header: "Total Amount" },
      {
        accessorKey: "actions",
        header: "Delete",
        Cell: ({ row }) => (
          <button
            onClick={() => deleteRecord(row.original.id)}
            className="text-red-500 text-xl"
          >
            <MdDelete />
          </button>
        ),
      },
    ],
    [deleteRecord],
  );

  // -------------------------
  // JSX Render
  // -------------------------
  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-medium text-gray-800">Sales</h1>
      <hr />

      {/* SALE DATE & BILL NO */}
      <div className="flex mt-5">
        <div className="mr-4 text-sm">
          <label className="mb-1">Sale Date:</label>
          <input
            readOnly
            type="date"
            name="saledate"
            value={form.saledate}
            onChange={handleSale}
            className="rounded-lg p-2 bg-transparent text-[var(--important)] font-bold outline-none"
          />
        </div>

        <div className="text-sm">
          <label className="mb-1">Bill No:</label>
          <input
            readOnly
            type="text"
            name="billno"
            value={form.billno}
            className="rounded-lg p-2 bg-transparent outline-none text-[var(--important)] font-bold"
          />
        </div>
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-1 mt-4">
        {/* PLAN */}
        <div className="flex flex-col text-sm md:mx-1">
          <label className="mb-1">Member *</label>

          <select
            name="memberid"
            value={form.memberid}
            onChange={handleSale}
            className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-full"
          >
            <option value="">Select Member</option>

            {Array.isArray(members) &&
              members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.customerId} - {member.mobile} - {member.firstname}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col text-sm md:mx-1">
          <label className="mb-1">Plan *</label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleSale}
            className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-full"
          >
            <option value="0">Select</option>
            {plans.map((plan, index) => (
              <option
                key={index}
                value={plan._id}
                data-price={plan.price}
                data-duration_months={plan.duration_months}
              >
                {plan.plan_name}
              </option>
            ))}
          </select>
        </div>

        {/* STAFF */}
        <div className="flex flex-col text-sm md:mx-1">
          <label className="mb-1">Staff *</label>
          <select
            name="staff"
            value={form.staff}
            onChange={handleSale}
            className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-full"
          >
            <option value="">Select</option>
            {staffs.map((ids, index) => (
              <option key={index} value={ids._id}>
                {ids.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* GST & Discount */}
        <div className="flex flex-col md:flex-row text-sm md:mx-1 justify-start gap-3 w-max">
          <section className="flex flex-col">
            <label className="mb-1">GST %</label>
            <select
              name="gstpercent"
              value={form.gstid}
              onChange={handleSale}
              className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-full"
            >
              <option value="0">0%</option>
              {gstvalues.map((gst, index) => (
                <option key={index} value={gst._id} data-price={gst.value}>
                  {gst.gstname}
                </option>
              ))}
            </select>
          </section>

          <section className="flex flex-col">
            <label className="mb-1">Discount</label>
            <select
              name="discount"
              value={form.discount}
              onChange={handleSale}
              className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-full"
            >
              <option value="0">None</option>
              {discountids.map((ids, index) => (
                <option key={index} value={ids._id}>
                  {ids.discountname}
                </option>
              ))}
            </select>
          </section>

          {discountoption && (
            <section className="flex flex-col">
              <label className="mb-1">
                {form.discount === "6976d97a34585fb711fa6a29"
                  ? "%"
                  : "Flat (₹)"}
              </label>
              <input
                placeholder="0.00"
                type="text"
                name="discountamt"
                onChange={handleSale}
                value={form.discountamt}
                className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-20"
              />
            </section>
          )}
        </div>

        {/* TOTAL AMOUNT */}
        <div className="flex items-end text-sm md:mx-1">
          <section className="flex flex-col">
            <label className="mb-1">Price</label>
            <input
              readOnly
              type="number"
              name="totalamount"
              value={Math.round(form.totalamount.toFixed(2))}
              className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-25"
            />
          </section>
          <section className="mx-auto">
            <button
              onClick={addRecord}
              className="flex items-center gap-1 bg-[var(--important)] text-white px-4 py-2 rounded-lg"
            >
              <MdAdd className="text-xl" />
            </button>
          </section>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto">
        <MaterialReactTable
          columns={columns}
          data={table}
          enableSorting={false}
          enableFilters={false}
          enableFullScreenToggle={false}
          enableColumnActions={false}
          enableTopToolbar={false}
          enableBottomToolbar={false}
        />
      </div>

      {/* FOOTER BAR */}
      <div className="fixed left-0 bottom-0 w-full bg-[var(--footerbg)] shadow-lg p-4 flex justify-evenly items-center z-1">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:w-100 text-lg lg:text-2xl">
          <span className="font-medium text-[var(--footertext)]">
            Total Plans: {table.length}
          </span>
          <span className="font-medium text-[var(--footertext)]">
            Total: {priceformat}
            {table.reduce((acc, data) => acc + data.total, 0)}
          </span>
        </div>
        <button
          onClick={() => changeOpen(true)}
          disabled={table.length === 0}
          className={`cursor-pointer px-6 py-2 rounded-lg text-white ${
            table.length === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[var(--important)]"
          }`}
        >
          Go to Payment
        </button>
      </div>

      {/* PAYMENT MODAL */}
      <SaleSummaryModal open={open} changeOpen={changeOpen} table={table} />
    </div>
  );
};

export default Sales;
