import { useEffect, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { MaterialReactTable } from "material-react-table";
import Box from "@mui/material/Box";
import { Autocomplete, TextField } from "@mui/material";
import { MdDelete, MdAdd, MdShoppingCart } from "react-icons/md";
import Swal from "sweetalert2";
import "../styles/sales.css";
import useStore from "../store/useStore.js";
import salesBg from "../assets/sales.png";
import {
  calculateGST,
  calculateDiscount,
} from "../store/calculationFunctions.js";
import api from "../services/apiService.js";
import SaleSummaryModal from "../pageUIBlocks/SaleSummary.jsx";

// ── Shared MUI styles ────────────────────────────────────────────────────────
const sx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--input-bg)",
    borderRadius: "6px",
    fontSize: "14px",
    "& fieldset": { borderColor: "var(--input-border)" },
    "&:hover fieldset": { borderColor: "var(--input-border-hover)" },
    "&.Mui-focused fieldset": { borderColor: "var(--input-border-focus)" },
  },
  "& .MuiSvgIcon-root": { color: "var(--input-icon)" },
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--input-label)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "5px",
  display: "block",
};

const cardTitleStyle = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--important)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 14,
};
// ────────────────────────────────────────────────────────────────────────────

function recalcTotals(updated) {
  if (updated.discount && updated.discount !== "0") {
    updated.discountfinalamt = calculateDiscount(
      updated.baseamount,
      updated.discountamt || 0,
      updated.discount,
    );
  } else {
    updated.discountfinalamt = 0;
  }
  updated.totalamount =
    updated.baseamount +
    (Number(updated.gstpercent) || 0) -
    updated.discountfinalamt;
  return updated;
}

function generateBillNo() {
  return "SI/" + Math.floor(10000 + Math.random() * 90000);
}

const Sales = () => {
  const [open, changeOpen] = useState(false);
  const [failedSources, setFailedSources] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const makeDefault = useCallback(
    () => ({
      memberid: "",
      saledate: new Date().toISOString().split("T")[0],
      billno: generateBillNo(),
      duration: 0,
      mobile: "",
      plan: "",
      planname: "",
      staff: "",
      staffname: "",
      discount: "0",
      discountamt: "",
      discountfinalamt: 0,
      gst: 0,
      gstid: "0",
      gstpercent: 0,
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date().toISOString().split("T")[0],
      totalamount: 0,
      baseamount: 0,
      creadtedby: user?.staff?.staffid || 1,
    }),
    [],
  );

  const {
    priceformat,
    discountids,
    gstvalues,
    plans,
    setstaff,
    staffs,
    branchid,
  } = useStore();

  const [form, setForm] = useState(makeDefault);
  const [members, setMembers] = useState([]);
  const [table, setTable] = useState([]);

  // ── Init: load all shared dropdowns independently so one failure
  //    never blocks the rest of the page ────────────────────────────────────

  // ── Members: separate fetch, isolated from dropdown init ─────────────────
  useEffect(() => {
    if (!branchid) return;
    api
      .post("/member/getmembers", { clientid: branchid })
      .then((res) => setMembers(res.data.records || []))
      .catch((err) => console.error("[Sales] Failed to load members:", err));
  }, [branchid]);

  const calculateExpiry = (startDate, duration) => {
    if (!startDate || !duration) return "";
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + Number(duration));
    return date.toISOString().split("T")[0];
  };

  const applyChange = useCallback((name, value, extra = {}) => {
    setForm((prev) => recalcTotals({ ...prev, [name]: value, ...extra }));
  }, []);

  const handleSale = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "startDate" && prev.duration) {
        updated.expiryDate = calculateExpiry(value, prev.duration);
      }
      return recalcTotals(updated);
    });
  }, []);

  // ── Options ───────────────────────────────────────────────────────────────
  const memberOptions = useMemo(
    () =>
      members.map((m) => ({
        label: `${m.customerId} - ${m.mobile} - ${m.firstname}`,
        value: m._id,
      })),
    [members],
  );

  const planOptions = useMemo(
    () =>
      plans.map((p) => ({
        label: p.plan_name,
        value: p._id,
        price: p.price,
        duration_months: p.duration_months,
      })),
    [plans],
  );

  const staffOptions = useMemo(
    () => staffs.map((s) => ({ label: s.fullName, value: s._id })),
    [staffs],
  );

  const gstOptions = useMemo(
    () => [
      { label: "No GST", value: "0", price: 0 },
      ...gstvalues.map((g) => ({
        label: g.gstname,
        value: g._id,
        price: g.value,
      })),
    ],
    [gstvalues],
  );

  const discountOptions = useMemo(
    () => [
      { label: "None", value: "0" },
      ...discountids.map((d) => ({ label: d.discountname, value: d._id })),
    ],
    [discountids],
  );

  const selectedMember =
    memberOptions.find((o) => o.value === form.memberid) || null;
  const selectedPlan = planOptions.find((o) => o.value === form.plan) || null;
  const selectedStaff =
    staffOptions.find((o) => o.value === form.staff) || null;
  const selectedGst =
    gstOptions.find((o) => o.value === form.gstid) || gstOptions[0];
  const selectedDiscount =
    discountOptions.find((o) => o.value === form.discount) ||
    discountOptions[0];
  const discountoption = form.discount !== "0" && form.discount !== "";

  // ── addRecord ─────────────────────────────────────────────────────────────
  const addRecord = useCallback(() => {
    if (form.totalamount < 0)
      return Swal.fire({
        title: "Wait",
        text: "Invalid total amount",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });
    if (!form.startDate || !form.expiryDate)
      return Swal.fire({
        title: "Wait",
        text: "Start & Expiry Date needed",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });
    if (!form.plan || !form.staff)
      return Swal.fire({
        title: "Missing Fields",
        text: "Plan & Staff are required!",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });
    if (discountoption && form.discountamt === "")
      return Swal.fire({
        text: "Enter discount amount",
        icon: "warning",
        confirmButtonColor: "var(--important)",
      });

    const newRecord = {
      duration: form.duration,
      startDate: form.startDate,
      expiryDate: form.expiryDate,
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
    setForm((prev) => ({
      ...makeDefault(),
      memberid: prev.memberid,
      saledate: prev.saledate,
      billno: prev.billno,
      startDate: prev.startDate,
    }));
  }, [form, discountoption, makeDefault]);

  const deleteRecord = useCallback((id) => {
    setTable((prev) => prev.filter((r) => r.id !== id));
    Swal.fire({
      title: "Deleted!",
      text: "Record removed",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  }, []);

  const handleSaleComplete = useCallback(() => {
    setTable([]);
    setForm(makeDefault());
    changeOpen(false);
  }, [makeDefault]);

  // ── Table columns ─────────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      { accessorKey: "planname", header: "Plan" },
      { accessorKey: "staffname", header: "Staff" },
      {
        header: `Base (${priceformat})`,
        Cell: ({ row }) => `${priceformat} ${row.original.baseprice}`,
      },
      {
        header: "Discount",
        Cell: ({ row }) =>
          row.original.discount > 0 ? (
            <span className="text-green-600">
              - {priceformat}
              {row.original.discount}
            </span>
          ) : (
            <span className="text-gray-400">—</span>
          ),
      },
      {
        header: "GST",
        Cell: ({ row }) => (
          <span>
            {row.original.gst}%{" "}
            <span className="text-xs text-gray-500">
              ({priceformat}
              {row.original.gstamount.toFixed(2)})
            </span>
          </span>
        ),
      },
      {
        header: "Validity",
        Cell: ({ row }) => (
          <span className="text-xs text-gray-600">
            {row.original.startDate} → {row.original.expiryDate}
          </span>
        ),
      },
      {
        header: "Total",
        Cell: ({ row }) => (
          <span className="font-semibold" style={{ color: "var(--important)" }}>
            {priceformat} {row.original.total}
          </span>
        ),
      },
      {
        header: "",
        accessorKey: "actions",
        Cell: ({ row }) => (
          <button
            onClick={() => deleteRecord(row.original.id)}
            className="text-red-400 hover:text-red-600 text-xl transition-colors"
          >
            <MdDelete />
          </button>
        ),
      },
    ],
    [deleteRecord, priceformat],
  );

  // ── Footer rendered via portal — escapes any parent transform/overflow ────
  const footer = createPortal(
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        background: "var(--footerbg)",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.18)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 20,
        padding: "10px 24px",
      }}
    >
      <span
        style={{ fontSize: 14, fontWeight: 500, color: "var(--footertext)" }}
      >
        Plans: <strong>{table.length}</strong>
      </span>
      <span
        style={{ fontSize: 14, fontWeight: 500, color: "var(--footertext)" }}
      >
        Grand Total:{" "}
        <strong style={{ fontSize: 17 }}>
          {priceformat}
          {table.reduce((acc, d) => acc + d.total, 0)}
        </strong>
      </span>
      <button
        onClick={() => changeOpen(true)}
        disabled={table.length === 0}
        style={{
          padding: "9px 26px",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 14,
          border: "none",
          cursor: table.length === 0 ? "not-allowed" : "pointer",
          background: table.length === 0 ? "#9ca3af" : "var(--cancel-color)",
          color: "#fff",
          transition: "opacity 0.15s",
        }}
      >
        Proceed to Payment →
      </button>
    </div>,
    document.body,
  );

  // ── Loading screen ────────────────────────────────────────────────────────


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="p-4 md:p-6 pb-20 bg-wrapper"
      style={{ backgroundImage: `url(${salesBg})` }}
    >
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Sales</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-light)" }}>
            Create and manage sales transactions
          </p>
        </div>
        <span className="text-sm text-white font-bold rounded-xl p-4 bg-[var(--important)]">
          Bill: <strong>{form.billno}</strong>
        </span>
      </div>

      {/* Warn if some dropdowns failed — page still fully usable */}
      {failedSources.length > 0 && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 14px",
            borderRadius: 8,
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            fontSize: 13,
            color: "#92400e",
          }}
        >
          ⚠️ Could not load: <strong>{failedSources.join(", ")}</strong>. Some
          dropdowns may be empty — please refresh if needed.
        </div>
      )}

      <hr className="mb-4" />

      {/* ── CARD 1: Bill Info ─────────────────────────────────────── */}
      <div style={{ marginBottom: 14 }}>
        <p style={cardTitleStyle}>Bill Info</p>
        <div className="flex flex-wrap gap-4 items-end">
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Sale Date</label>
            <TextField
              type="date"
              size="small"
              name="saledate"
              value={form.saledate}
              onChange={handleSale}
              sx={{ width: 160, ...sx }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 240,
            }}
          >
            <label style={labelStyle}>Member</label>
            <Autocomplete
              options={memberOptions}
              value={selectedMember}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_, v) => applyChange("memberid", v ? v.value : "")}
              sx={{ ...sx }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Search by ID, mobile or name…"
                />
              )}
            />
          </Box>
        </div>
      </div>

      {/* ── CARD 2: Plan Details ──────────────────────────────────── */}
      <div style={{ marginBottom: 14 }}>
        <p style={cardTitleStyle}>Plan Details</p>

        {/* Row 1 — Plan, Staff, Dates */}
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Plan *</label>
            <Autocomplete
              options={planOptions}
              value={selectedPlan}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_, newVal) => {
                if (!newVal) return;
                const duration = Number(newVal.duration_months);
                const price = Number(newVal.price);
                const expiryDate = calculateExpiry(form.startDate, duration);
                applyChange("plan", newVal.value, {
                  planname: newVal.label,
                  duration,
                  baseamount: price,
                  expiryDate,
                });
              }}
              sx={{ width: 210, ...sx }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select plan…"
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Assigned Staff *</label>
            <Autocomplete
              options={staffOptions}
              value={selectedStaff}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_, v) =>
                applyChange("staff", v ? v.value : "", {
                  staffname: v ? v.label : "Unknown",
                })
              }
              sx={{ width: 200, ...sx }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select staff…"
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Start Date</label>
            <TextField
              type="date"
              size="small"
              name="startDate"
              value={form.startDate}
              onChange={handleSale}
              sx={{ width: 155, ...sx }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Expiry Date</label>
            <TextField
              type="date"
              size="small"
              name="expiryDate"
              value={form.expiryDate}
              inputProps={{ readOnly: true }}
              sx={{
                width: 155,
                ...sx,
                "& .MuiOutlinedInput-root": {
                  ...sx["& .MuiOutlinedInput-root"],
                  fontWeight: 600,
                  color: "var(--important)",
                },
              }}
            />
          </Box>
        </div>

        {/* Row 2 — Pricing */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-end",
            paddingTop: 14,
            borderTop: "1px solid var(--input-border, #e5e7eb)",
          }}
        >
          {/* GST */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>GST</label>
            <Autocomplete
              disableClearable
              options={gstOptions}
              value={selectedGst}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_, newVal) => {
                if (!newVal) return;
                setForm((prev) => {
                  const updated = { ...prev };
                  if (newVal.value === "0") {
                    updated.gstpercent = 0;
                    updated.gst = 0;
                    updated.gstid = "0";
                  } else {
                    updated.gstpercent = calculateGST(
                      prev.baseamount,
                      newVal.price,
                    );
                    updated.gst = newVal.price;
                    updated.gstid = newVal.value;
                  }
                  return recalcTotals(updated);
                });
              }}
              sx={{ width: 130, ...sx }}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </Box>

          {/* Discount Type */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Discount Type</label>
            <Autocomplete
              disableClearable
              options={discountOptions}
              value={selectedDiscount}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(o, v) => o.value === v.value}
              onChange={(_, v) =>
                applyChange("discount", v ? v.value : "0", {
                  discountamt: "",
                  discountfinalamt: 0,
                })
              }
              sx={{ width: 160, ...sx }}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </Box>

          {/* Discount Amount */}
          {discountoption && (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <label style={labelStyle}>
                {form.discount === "6976d97a34585fb711fa6a29"
                  ? "Disc %"
                  : "Disc Amt (₹)"}
              </label>
              <TextField
                size="small"
                placeholder="0.00"
                name="discountamt"
                value={form.discountamt}
                onChange={handleSale}
                sx={{ width: 110, ...sx }}
              />
            </Box>
          )}

          {/* Separator */}
          <div
            style={{
              width: 1,
              height: 36,
              background: "var(--input-border, #e5e7eb)",
              alignSelf: "flex-end",
              marginBottom: 2,
            }}
          />

          {/* Total Price */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <label style={labelStyle}>Total Price</label>
            <TextField
              size="small"
              type="number"
              value={Math.round(form.totalamount)}
              inputProps={{ readOnly: true }}
              sx={{
                width: 130,
                ...sx,
                "& .MuiOutlinedInput-root": {
                  ...sx["& .MuiOutlinedInput-root"],
                  fontWeight: 700,
                  color: "var(--important)",
                  background:
                    "color-mix(in srgb, var(--important, #6366f1) 10%, white)",
                },
              }}
            />
          </Box>

          {/* ADD button */}
          <button
            onClick={addRecord}
            title="Add to cart"
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 20px",
              borderRadius: 8,
              background: "var(--important)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              alignSelf: "flex-end",
              whiteSpace: "nowrap",
            }}
          >
            <MdAdd style={{ fontSize: 20 }} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* ── TABLE ────────────────────────────────────────────────── */}
      {table.length > 0 ? (
        <div className="mt-1 overflow-x-auto rounded-xl border border-gray-200">
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
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-300 gap-2">
          <MdShoppingCart style={{ fontSize: 52 }} />
          <p className="text-sm">No plans added yet</p>
        </div>
      )}

      {/* ── FOOTER via portal ── */}
      {footer}

      {/* ── PAYMENT MODAL ── */}
      <SaleSummaryModal
        open={open}
        changeOpen={changeOpen}
        table={table}
        onSaleComplete={handleSaleComplete}
      />
    </div>
  );
};

export default Sales;
