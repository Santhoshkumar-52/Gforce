// planMaster.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'branchmaster',
            required: true,
            index: true,
        },
        plan_name: {
            type: String,
            required: true,
            index: true,
        },

        plan_description: {
            type: String,
        },

        duration_months: {
            type: Number,
            required: true,
            index: true,
        },

        price: {
            type: Number,
            required: true,
            index: true,
        },

        is_active: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: false },
    }
);

export default mongoose.model("planmaster", planSchema, "planmaster");
