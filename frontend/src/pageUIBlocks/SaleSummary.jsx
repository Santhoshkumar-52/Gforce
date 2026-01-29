import { Modal, Box } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import CommonValueContext from "../layouts/CommonvalueContext.jsx";
import axios from "axios";

export default function SaleSummaryModal({ open, changeOpen, table }) {
  const { priceformat, baseUrl, user, branchid } =
    useContext(CommonValueContext);
  const staffid = user?.staff?._id;

  const [payment, setPayment] = useState({
    cash: 0,
    card: 0,
    upi: 0,
  });

  const summary = useMemo(() => {
    return table.reduce(
      (acc, row) => {
        acc.totalItems += 1;
        acc.totalDiscount += Number(row.discount || 0);
        acc.totalGST += Number(row.gstamount || 0);
        acc.totalAmount += Number(row.total || 0);
        return acc;
      },
      {
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
    setPayment((prev) => ({
      ...prev,
      [name]: Number(value) || 0,
    }));
  };

  const handlePay = async () => {
    const payload = {
      sales: table,
      summary,
      payment,
      staffid,
      branchid, 
    };

    try {
      const res = await axios.post(`${baseUrl}/api/sales/addsale`, payload);

      // assuming backend sends: { status: "success", message: "...", printUrl?: "..." }
      if (res.data?.status === "success") {
        // open blank window (or image URL) and trigger print
        const printWindow = window.open(
          res.data.printUrl || "about:blank",
          "_blank",
        );

        if (printWindow) {
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        }
      } else {
        // backend responded but status is not success
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: res.data?.message || "Something went wrong",
        });
      }
    } catch (error) {
      // axios / network / server error
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
  const autoInsertAmt = (e) => {
    const { name } = e.target;
    setPayment({
      cash: 0,
      card: 0,
      upi: 0,
      [name]: balanceAmount,
    });
  };

  return (
    <Modal open={open} onClose={() => changeOpen(false)}>
      <Box
        className="
        absolute top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        w-[95%] md:w-[600px] lg:w-[780px]
        rounded-xl bg-white shadow-2xl p-4 md:p-6
      "
      >
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 border-b pb-2">
          Payment Summary
        </h2>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SUMMARY */}
          <div className="space-y-3 text-sm md:text-base lg:text-lg">
            <div className="flex justify-between">
              <span>Total Items</span>
              <span className="font-semibold">{summary.totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">
                {priceformat} {summary.totalDiscount}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST</span>
              <span className="text-blue-600">
                {priceformat} {summary.totalGST}
              </span>
            </div>

            <div className="flex justify-between font-bold text-base md:text-lg lg:text-xl border-t pt-3">
              <span>Total</span>
              <span>
                {priceformat} {summary.totalAmount}
              </span>
            </div>

            <div className="flex justify-between font-semibold text-red-600">
              <span>Balance</span>
              <span>
                {priceformat} {balanceAmount}
              </span>
            </div>
          </div>

          {/* PAYMENT MODE */}
          <div className="space-y-4">
            {[
              { label: "Cash", name: "cash" },
              { label: "Card", name: "card" },
              { label: "UPI", name: "upi" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <button
                  name={item.name}
                  onClick={autoInsertAmt}
                  className="
                  w-24 md:w-28 h-10 md:h-12
                  text-white rounded-lg
                  text-sm md:text-lg font-semibold
                  cursor-pointer
                "
                  style={{
                    backgroundColor: `var(--${item.name}-color)`,
                  }}
                >
                  {item.label}
                </button>

                <input
                  type="number"
                  name={item.name}
                  value={payment[item.name]}
                  onChange={handleChange}
                  className="
                  flex-1 border rounded-lg px-3 py-2
                  text-right text-sm md:text-lg
                  outline-none
                "
                  placeholder="0.00"
                />
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6">
          <button
            className="
            px-6 md:px-10 py-2 md:py-3
            rounded-lg text-sm md:text-xl
            text-white font-bold
          "
            style={{ backgroundColor: "var(--save-color)" }}
            onClick={handlePay}
          >
            Pay {priceformat}
            {summary.totalAmount}
          </button>
        </div>
      </Box>
    </Modal>
  );
}
