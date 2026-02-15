import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branchmaster",
      required: true,
    },
    billno: {
      type: String, // ex: SI/73592
      required: true,
      unique: true,
      index: true,
    },

    saleUniqueId: {
      type: String, // ex: SI/73592
      required: true,
      unique: true,
      index: true,
    },

    saleDate: {
      type: Date,
      required: true,
    },
    saleType: {
      type: String,
      required: true,
      default: "SI",
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "membermaster",
      required: true,
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffmaster",
    },

    baseAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    gstAmount: {
      type: Number,
      default: 0,
    },

    nettAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    creadtedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffmaster",
      required: true,
    },

    paymentMode: {
      cash: { type: Number, default: 0 },
      card: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ["PAID", "CANCELLED", "REFUNDED", "RENEWED"],
      default: "PAID",
    },
  },
  { timestamps: true },
);

export default mongoose.model("salemaster", saleSchema, "salemaster");
