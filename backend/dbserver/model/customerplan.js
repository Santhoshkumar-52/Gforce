// customerPlan.js
import mongoose from "mongoose";

const customerPlanSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "customermaster",
            required: true,
            index: true,
        },

        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "planmaster",
            required: true,
            index: true,
        },

        start_date: {
            type: Date,
            required: true,
        },

        expiry_date: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Active", "Expired", "Pending"],
            default: "Pending",
        },

        payment_made: {
            type: Number,
            default: 0.0,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

export default mongoose.model(
    "customerplan",
    customerPlanSchema,
    "customerplan"
);
