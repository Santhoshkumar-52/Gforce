import { Modal, Box, TextField } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import CommonValueContext from "../layouts/CommonvalueContext.jsx";
import axios from "axios";
import Swal from "sweetalert2";

// Shared input style matching Sale.jsx
const sx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--input-bg)",
    borderRadius: "6px",
    fontSize: "14px",
    "& fieldset": { borderColor: "var(--input-border)" },
    "&:hover fieldset": { borderColor: "var(--input-border-hover)" },
    "&.Mui-focused fieldset": { borderColor: "var(--input-border-focus)" },
  },
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

const PAYMENT_METHODS = [
  { label: "Cash", name: "cash", colorVar: "--cash-color" },
  { label: "Card", name: "card", colorVar: "--card-color" },
  { label: "UPI", name: "upi", colorVar: "--upi-color" },
];

export default function SaleSummaryModal({
  open,
  changeOpen,
  table,
  onSaleComplete, // ← new: called after successful save to reset parent state
}) {
  const { priceformat, baseUrl, user, branchid } =
    useContext(CommonValueContext);
  const staffid = user?.staff?._id;

  const [payment, setPayment] = useState({ cash: 0, card: 0, upi: 0 });

  const summary = useMemo(() => {
    return table.reduce(
      (acc, row) => {
        acc.totalItems += 1;
        acc.totalDiscount += Number(row.discount || 0);
        acc.totalGST += Number(row.gstamount || 0);
        acc.totalAmount += Number(row.total || 0);
        acc.totalBasePrice += Number(row.baseprice);
        return acc;
      },
      {
        totalBasePrice: 0,
        totalItems: 0,
        totalDiscount: 0,
        totalGST: 0,
        totalAmount: 0,
      },
    );
  }, [table]);

  const paidAmount = payment.cash + payment.card + payment.upi;
  const balanceAmount = summary.totalAmount - paidAmount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  // Click a payment method button → fill in the full balance with that method
  const autoInsertAmt = (name) => {
    setPayment({ cash: 0, card: 0, upi: 0, [name]: balanceAmount });
  };

  const handleClose = () => {
    setPayment({ cash: 0, card: 0, upi: 0 });
    changeOpen(false);
  };

  const handlePay = async () => {
    if (paidAmount < summary.totalAmount) {
      const result = await Swal.fire({
        title: "Partial Payment?",
        text: "Paid amount is less than the bill total. Proceed with partial payment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "No, cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      if (!result.isConfirmed) return;
    }

    const payload = { sales: table, summary, payment, staffid, branchid };

    try {
      const res = await axios.post(`${baseUrl}/api/sales/addsale`, payload);

      if (res.data?.status === "success") {
        // Open invoice in a new tab
        window.open(`/sales/invoice/${res.data.saleUniqueId}`, "_blank");
        // Reset payment state locally
        setPayment({ cash: 0, card: 0, upi: 0 });
        // Tell the parent to reset everything (table, form, billno)
        onSaleComplete?.();
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: res.data?.message || "Something went wrong",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Server error occurred",
      });
    }
  };

  // ── Row component ─────────────────────────────────────────────────────────
  const SummaryRow = ({ label, value, className = "" }) => (
    <div className={`flex justify-between items-center py-1 ${className}`}>
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: 560, md: 700 },
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "var(--important)",
            padding: "14px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: 0 }}
          >
            Payment Summary
          </h2>
          <button
            onClick={handleClose}
            style={{
              color: "#fff",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── LEFT: Summary ── */}
            <div>
              <p style={{ ...labelStyle, marginBottom: 10 }}>Bill Summary</p>
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "12px 16px",
                }}
              >
                <SummaryRow label="Total Plans" value={summary.totalItems} />
                <SummaryRow
                  label="Base Price"
                  value={`${priceformat} ${summary.totalBasePrice.toFixed(2)}`}
                />
                <SummaryRow
                  label="Discount"
                  value={
                    <span className="text-green-600">
                      - {priceformat} {summary.totalDiscount.toFixed(2)}
                    </span>
                  }
                />
                <SummaryRow
                  label="GST"
                  value={
                    <span className="text-blue-600">
                      + {priceformat} {summary.totalGST.toFixed(2)}
                    </span>
                  }
                />
                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    marginTop: 8,
                    paddingTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className="font-bold text-base">Grand Total</span>
                  <span
                    className="font-bold text-lg"
                    style={{ color: "var(--important)" }}
                  >
                    {priceformat} {summary.totalAmount}
                  </span>
                </div>
              </div>

              {/* Balance indicator */}
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: balanceAmount > 0 ? "#fef2f2" : "#f0fdf4",
                  border: `1px solid ${balanceAmount > 0 ? "#fecaca" : "#bbf7d0"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: balanceAmount > 0 ? "#dc2626" : "#16a34a",
                  }}
                >
                  {balanceAmount > 0 ? "Balance Due" : "Fully Paid ✓"}
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: balanceAmount > 0 ? "#dc2626" : "#16a34a",
                  }}
                >
                  {priceformat} {Math.abs(balanceAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* ── RIGHT: Payment Input ── */}
            <div>
              <p style={{ ...labelStyle, marginBottom: 10 }}>Payment Mode</p>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((item) => (
                  <div
                    key={item.name}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {/* Method button — click to auto-fill balance */}
                    <button
                      onClick={() => autoInsertAmt(item.name)}
                      title={`Fill ${item.label} with balance`}
                      style={{
                        width: 72,
                        height: 40,
                        borderRadius: 8,
                        background: `var(${item.colorVar})`,
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                        border: "none",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {item.label}
                    </button>

                    {/* Amount input */}
                    <Box sx={{ flex: 1 }}>
                      <label style={labelStyle}>{item.label} Amount</label>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        name={item.name}
                        value={payment[item.name]}
                        onChange={handleChange}
                        placeholder="0.00"
                        inputProps={{ style: { textAlign: "right" } }}
                        sx={sx}
                      />
                    </Box>
                  </div>
                ))}
              </div>

              {/* Paid total */}
              <div
                style={{
                  marginTop: 14,
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <span
                  className="font-bold"
                  style={{ color: "var(--important)" }}
                >
                  {priceformat} {paidAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Pay button ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button
              onClick={handlePay}
              style={{
                padding: "11px 36px",
                borderRadius: 8,
                background: "var(--save-color, var(--important))",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
              }}
            >
              Confirm & Pay {priceformat}
              {summary.totalAmount}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
