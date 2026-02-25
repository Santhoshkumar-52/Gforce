import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branchmaster',
        required: true,
        index: true,
    },
    discountname: {
        type: String,
        required: true,
        unique: true
    },
    activestatus: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model("discountmaster", discountSchema, "discountmaster");
