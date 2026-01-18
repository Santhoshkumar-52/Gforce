import { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { MdDelete, MdAdd } from "react-icons/md";
import Swal from "sweetalert2";
import "../styles/sales.css";
import useAuthStore from "../store/useStore.js";
import {
  calculateGST,
  calculateDiscount,
} from "../store/calculationFunctions.js";

const Sales = () => {
  const saleid = Math.floor(10000 + Math.random() * 90000);
  const [open, changeOpen] = useState(false);

  const {
    setdicountids,
    discountids,
    gstvalues,
    setgstids,
    setplanids,
    plans,
    setstaff,
    staffs,
  } = useAuthStore();

  useEffect(() => {
    setdicountids();
    setgstids();
    setplanids();
    setstaff();
  }, []);

  const [form, setForm] = useState({
    saledate: new Date().toISOString().split("T")[0],
    billno: saleid,
    mobile: "",
    plan: "",
    planname: "",
    staff: "",
    staffname: "",
    discount: "",
    discountamt: "",
    discountfinalamt: "",
    gst: "",
    gstpercent: "",
    totalamount: 0,
    baseamount: 0,
  });
  const [discountoption, changediscount] = useState(false);

  const [table, setTable] = useState([]);

  const handleSale = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "plan") {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const price = value === "0" ? 0 : Number(selectedOption.dataset.price);

        // updated.totalamount = price; // NUMBER
        updated.baseamount = price; // NUMBER
        updated.planname = value === "0" ? "Unknown" : selectedOption.text;
      }
      if (name === "staff") {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const staffname = value == "" ? "Unknown" : selectedOption.text;
        updated.staffname = staffname;
      }
      if (name == "gstpercent" && updated.baseamount != 0) {
        const gstpercent =
          value == "0"
            ? 0
            : Number(e.target.options[e.target.selectedIndex].dataset.price);
        const gstAmount = calculateGST(updated.baseamount, gstpercent);
        // updated.totalamount += gstAmount;
        updated.gstpercent = gstAmount;
        updated.gst = gstpercent;
      }
      if (name == "discount" && updated.baseamount != 0) {
        value != "0" ? changediscount(true) : changediscount(false);
      }
      if (name == "discountamt" && updated.discount != "0") {
        const discountamt = calculateDiscount(
          updated.baseamount,
          updated.discountamt,
          updated.discount
        );
        updated.discountfinalamt = discountamt;
      }
      updated.totalamount =
        updated.baseamount + updated.gstpercent - updated.discountfinalamt;
      return updated;
    });
  };

  const addRecord = () => {
    if (!form.plan || !form.staff || form.totalamount == 0.0) {
      Swal.fire({
        title: "Missing Required Fields",
        text: "Plan, Staff & Price are required!",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });
      return;
    }

    if (form.discount && form.discount != "0" && form.discountamt == "") {
      Swal.fire({
        text: "Invalid Discount Number",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });
      return;
    }

    const newRecord = {
      plan: form.plan,
      planname: form.planname,
      staff: form.staff,
      staffname: form.staffname,
      baseprice: form.baseamount,
      discount: form.discount || 0,
      gst: form.gst || 0,
      gstamount: form.gstpercent || 0,
      total: Math.round(form.totalamount),
    };

    setTable((prev) => [...prev, newRecord]);
  };

  const deleteRecord = (id) => {
    const updated = table.filter((r) => r.id !== id);
    setTable(updated);

    Swal.fire({
      title: "Deleted!",
      text: "Record removed successfully",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });

    console.log("Records:", id);
  };

  const columns = [
    { accessorKey: "planname", header: "Plan" },
    { accessorKey: "staffname", header: "Alloted Staff" },
    { accessorKey: "baseprice", header: "Base Price (Rs.)" },
    { accessorKey: "discount", header: "Discount" },
    {
      header: "GST (%)",
      Cell: ({ row }) => (
        <>
          {row.original.gst}% <br />
          <span className="text-gray-500 text-xs">
            ₹ {row.original.gstamount.toFixed(2)}
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
  ];

  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-medium text-gray-800">Sales</h1>
      <hr />
      <div className="flex mt-5">
        <div className="mr-4 text-sm">
          <label className="mb-1">Sale Date:</label>
          <input
            required
            readOnly
            type="date"
            name="saledate"
            value={form.saledate}
            onChange={handleSale}
            className="rounded-lg p-2 bg-transparent text-[var(--important)] font-bold  outline-none"
          />
        </div>

        {/* Bill No */}
        <div className="text-sm">
          <label className="mb-1">Bill No:</label>
          <input
            required
            readOnly
            type="text"
            name="billno"
            value={form.billno}
            className="rounded-lg p-2 bg-transparent outline-none text-[var(--important)] font-bold"
          />
        </div>
      </div>
      {/* RESPONSIVE 5-COLUMN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5   gap-1 mt-4">
        {/* Sale Date */}

        {/* PLAN */}
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
              <option key={index} value={plan.planid} data-price={plan.price}>
                {plan.planname}
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
              <option key={index} value={ids.staffid}>
                {ids.staffname}
              </option>
            ))}
          </select>
        </div>

        {/* GST */}
        <div className="flex flex-col md:flex-row text-sm md:mx-1 justify-start gap-3 w-max">
          <section className="flex flex-col">
            <label className="mb-1">GST %</label>
            <select
              name="gstpercent"
              value={form.gstpercent}
              onChange={handleSale}
              className="rounded-lg p-2 bg-transparent border border-gray-400 outline-none cursor-pointer w-full"
            >
              <option value="0">0%</option>
              {gstvalues.map((gst, index) => (
                <option key={index} value={gst.gstid} data-price={gst.value}>
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
              <option value="0" defaultValue={true}>
                None
              </option>
              {discountids.map((ids, index) => (
                <option key={index} value={ids.discountid}>
                  {ids.discountcategory}
                </option>
              ))}
            </select>
          </section>
          {discountoption == true ? (
            <section className="flex flex-col">
              <label className="mb-1">
                {form.discount == "1" ? "%" : "Flat (₹)"}
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
          ) : (
            ""
          )}
        </div>
        {/* <div className="flex flex-col text-sm md:mx-1"></div> */}

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
        <span className="text-lg font-medium text-[var(--important-text)]">
          Total Records: {table.length}
        </span>

        <button
          onClick={() => changeOpen(true)}
          disabled={table.length === 0}
          className={`px-6 py-2 rounded-lg text-white ${
            table.length === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[var(--important)]"
          }`}
        >
          Go to Payment
        </button>
      </div>

      <Modal
        open={open}
        onClose={() => changeOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <button
            onClick={() => changeOpen(false)}
            style={{
              float: "right",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "2px 6px",
              cursor: "pointer",
            }}
          >
            X
          </button>

          <h2 id="modal-title">Modal Title</h2>
          <p id="modal-description">This is the modal content area.</p>
          <button
            onClick={() => {
              // perform action
              changeOpen(false);
            }}
          >
            Save
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default Sales;
