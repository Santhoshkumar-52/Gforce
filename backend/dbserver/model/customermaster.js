// memberMaster.model.js
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
    {
        customerId: { type: Number, unique: true },

        firstname: { type: String, required: true },
        lastname: { type: String },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branchmaster",
            required: true
        }, dob: { type: Date },

        marital_status: {
            type: String,
            enum: ["Single", "Married", "Divorced", "Widowed"]
        },

        mobile: { type: String, required: true, unique: true },
        alternate_mobile: { type: String },

        email: { type: String },

        address_line1: { type: String },
        address_line2: { type: String },
        area: { type: String },

        city: { type: String, default: "Chennai" },
        pincode: { type: String },
        state: { type: String, default: "Tamil Nadu" },
        country: { type: String, default: "India" },

        aadhaar: { type: String },
        pan: { type: String },

        govt_id_type: { type: String },
        govt_id_number: { type: String },

        emergency_contact_name: { type: String },
        emergency_contact_relation: { type: String },
        emergency_contact_number: { type: String },

        occupation: { type: String },

        isactive: { type: Boolean, default: true },
        joined_date: { type: Date, default: Date.now },

        notes: { type: String }
    },
    { timestamps: true }
);
export default mongoose.model("Membermaster", memberSchema, "membermaster");