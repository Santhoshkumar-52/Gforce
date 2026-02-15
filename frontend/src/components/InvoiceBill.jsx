import React, { useContext, useEffect, useState } from "react";
import "../styles/invoice.css";
import { useParams } from "react-router-dom";
import CommonValueContext from "../layouts/CommonvalueContext.jsx";
import axios from "axios";
import Swal from "sweetalert2";

export default function InvoiceBill() {
  const { saleUniqueId } = useParams();
  const { baseUrl, branchid } = useContext(CommonValueContext);

  const [saleData, setSaleData] = useState(null);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/sales/getsaledetail/${saleUniqueId}`,
        );

        const data = response.data[0];

        setSaleData({
          billNo: data.billno,
          saleUniqueId: saleUniqueId,
          saleDate: data.saleDate,
          saleType: "SI",

          memberName: data.membername,
          memberId: data.memberid,

          baseAmount: data.baseAmount,
          discountAmount: data.discountAmount,
          gstAmount: data.gstAmount,
          nettAmount: data.nettAmount,
          paidAmount: data.paidAmount,
          balance: data.balance,
          change: data.change,

          paymentMode: data.paymentMode,
          status: data.status,

          createdBy: data.createdStaff,
          allocatedStaff: data.allotedstaff,
          location: data.location,
          branchname: data.branchname,

          planName: data.plan_name,
          startDate: data.startDate,
          expiryDate: data.expiryDate,
          isActive: data.isActive,
          isExpired: data.isExpired,
          cancelled: data.cancelled,
          branchImage: data.branchImage,
          address: data.address,
          mobile: data.mobile,
          GSTNo: data.GSTNo,

          createdAt: data.saleDate,
          updatedAt: data.saleDate,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed to load invoice",
        });
      }
    };

    fetchSaleDetails();
  }, [saleUniqueId]);

  if (!saleData) return null;

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

  const paymentModes = Object.entries(saleData.paymentMode || {})
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => `${key.toUpperCase()} : ${formatCurrency(value)}`);

  return (
    <div className="bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="invoice-header text-white p-3 md:p-8 flex flex-col md:flex-row justify-between gap-4">
          <div className="p-0.5 bg-white shadow-2xl rounded logo-box w-full md:w-40 h-20 flex items-center justify-center overflow-hidden">
            <img
              src={
                saleData.branchImage ||
                "../../src/assets/Gforce_placeholder.webp"
              }
              alt="Branch Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="branch_details">
            <h1 className="text-2xl font-bold">{saleData.branchname}</h1>
            <div className="flex flex-col h-13 justify-between md:text-center">
              <small>{saleData.address}</small>
              <small>
                Mobile: {saleData.mobile} | GST: {saleData.GSTNo}
              </small>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm opacity-80">Bill Number</p>
            <p className="text-2xl font-bold">{saleData.billNo}</p>
            <span
              className={`status-badge mt-2 inline-block px-3 py-1 text-xs font-semibold rounded ${
                saleData.status === "PAID"
                  ? "status-paid"
                  : saleData.status === "RENEWED"
                    ? "status-pending"
                    : "status-unpaid"
              }`}
            >
              {saleData.status}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8 relative">
          <img
            src={
              saleData.branchImage || "../../src/assets/Gforce_placeholder.webp"
            }
            alt="Branch Logo"
            className="w-full h-full object-contain absolute opacity-4 top-0 bottom-0 left-0 right-0 m-auto pointer-events-none"
          />
          {/* Details Grid */}
          <h1 className="font-bold text-center opacity-40">
            -- TAX INVOICE --
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="section-box">
              <h3 className="section-title">Bill To</h3>
              <p className="font-bold text-lg">{saleData.memberName}</p>
              <p className="text-sm">Member ID: {saleData.memberId}</p>
              <p className="text-sm">Branch: {saleData.location}</p>
            </div>

            <div className="section-box">
              <h3 className="section-title">Plan Details</h3>
              <p className="text-sm">Plan: {saleData.planName}</p>
              <p className="text-sm">Start: {formatDate(saleData.startDate)}</p>
              <p className="text-sm">
                Expiry: {formatDate(saleData.expiryDate)}
              </p>
              <p className="text-sm font-bold">
                Status:{" "}
                {saleData.isActive
                  ? "Active"
                  : saleData.isExpired
                    ? "Expired"
                    : saleData.cancelled
                      ? "Cancelled"
                      : "Inactive"}
              </p>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="section-box">
              <h3 className="section-title">Payment Info</h3>
              {paymentModes.map((mode) => (
                <p key={mode} className="text-sm">
                  {mode}
                </p>
              ))}
              <p className="text-sm">Trainer: {saleData.allocatedStaff}</p>
              <p className="text-sm">Created By: {saleData.createdBy}</p>
              <p className="text-sm">
                Sale Date: {formatDate(saleData.saleDate)}
              </p>
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
              <div className="flex justify-between text-sm font-semibold">
                <span>Change</span>
                <span>{formatCurrency(saleData.change)}</span>
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
