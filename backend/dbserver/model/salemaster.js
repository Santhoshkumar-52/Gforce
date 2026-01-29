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
        discounttype: {
            type: Number,
            default: 0
        },
        discountAmount: {
            type: Number,
            default: 0,
        },

        gstPercent: {
            type: Number,
            default: 0,
        },

        gstAmount: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        paymentMode: {
            cash: { type: Number, default: 0 },
            card: { type: Number, default: 0 },
            upi: { type: Number, default: 0 },
        },

        status: {
            type: String,
            enum: ["PAID", "CANCELLED", "REFUNDED"],
            default: "PAID",
        },
    },
    { timestamps: true }
);

export default mongoose.model("salemaster", saleSchema, "salemaster");
