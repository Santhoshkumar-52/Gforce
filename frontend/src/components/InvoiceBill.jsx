import React, { useContext, useEffect, useState } from "react";
import "../styles/invoice.css";
import { useParams } from "react-router-dom";
import CommonValueContext from "../layouts/CommonvalueContext.jsx";
import axios from "axios";
import Swal from "sweetalert2";

export default function InvoiceBill() {
  const { saleUniqueId } = useParams();
  const { baseUrl, branchid } = useContext(CommonValueContext);
  const [saleData, setSaleData] = useState({
    billNo: "SI/70721",
    saleUniqueId: "86651786185",
    saleDate: new Date(),
    saleType: "SI",
    memberId: "696a3eb5d25db946a7c96b02",
    baseAmount: 1500,
    discountAmount: 0,
    gstAmount: 0,
    nettAmount: 1500,
    paidAmount: 1500,
    balance: 0,
    change: 0,
    createdBy: "6969c17deadc51e2a6fbf2d7",
    paymentMode: "Cash",
    status: "PAID",
    createdAt: new Date(),
    updatedAt: new Date(),
    branchId: "6969e6fc89c79021fb7b28f3",
    planId: "6976df755f4030c0ad833992",
    allocatedStaff: "6969c17deadc51e2a6fbf2d8",
    startDate: new Date(),
    expiryDate: new Date(),
    isActive: true,
  });

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/sales/getsaledetail/${saleUniqueId}`,
        );

        console.log(response.data);
      } catch (err) {
        Swal.fire({
          icon: err.data.icon,
          title: err.data.title,
        });
      }
    };

    fetchSaleDetails();
  }, [saleUniqueId]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="invoice-header text-white p-6 md:p-8 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">SALES INVOICE</h1>
            <p className="text-sm opacity-90">
              Payment Receipt & Transaction Details
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm opacity-80">Invoice Number</p>
            <p className="text-2xl font-bold">{saleData.billNo}</p>
            <span
              className={`status-badge mt-2 inline-block px-3 py-1 text-xs font-semibold rounded ${
                saleData.status === "PAID"
                  ? "status-paid"
                  : saleData.status === "PENDING"
                    ? "status-pending"
                    : "status-unpaid"
              }`}
            >
              {saleData.status}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="section-box">
              <h3 className="section-title">Bill To</h3>
              <p className="font-bold text-lg">Dynamic Customer</p>
              <p className="text-sm">Member ID: {saleData.memberId}</p>
              <p className="text-sm">Branch: {saleData.branchId}</p>
            </div>

            <div className="section-box">
              <h3 className="section-title">Plan Details</h3>
              <p className="text-sm">Plan ID: {saleData.planId}</p>
              <p className="text-sm">Start: {formatDate(saleData.startDate)}</p>
              <p className="text-sm">
                Expiry: {formatDate(saleData.expiryDate)}
              </p>
              <p className="text-sm">
                Status: {saleData.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="section-box">
              <h3 className="section-title">Payment Info</h3>
              <p className="text-sm">Mode: {saleData.paymentMode}</p>
              <p className="text-sm">Created By: {saleData.createdBy}</p>
              <p className="text-sm">Sale Type: {saleData.saleType}</p>
            </div>

            <div className="amount-box space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base Amount</span>
                <span>{formatCurrency(saleData.baseAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount</span>
                <span>-{formatCurrency(saleData.discountAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST</span>
                <span>{formatCurrency(saleData.gstAmount)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Net Amount</span>
                <span>{formatCurrency(saleData.nettAmount)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Paid</span>
                <span>{formatCurrency(saleData.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-red-600 font-semibold">
                <span>Balance</span>
                <span>{formatCurrency(saleData.balance)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-sm flex flex-col md:flex-row justify-between gap-4">
            <p>Created: {new Date(saleData.createdAt).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">
              ** This is a Computer Generated Bill **
            </p>
            <p>Updated: {new Date(saleData.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
