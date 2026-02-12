import mongoose from "mongoose";

const memberPlanSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "membermaster",
            required: true,
            index: true,
        },

        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "planmaster",
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        saleUniqueId: {
            type: String,
            required: true,
            index: true,
        },
        allotedstaff: {
            type: String,
            required: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        isExpired: {
            type: Boolean,
            default: false,
        },

        cancelled: {
            type: Boolean,
            default: false,
        },

        remarks: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("memberplan", memberPlanSchema, "memberplan");
