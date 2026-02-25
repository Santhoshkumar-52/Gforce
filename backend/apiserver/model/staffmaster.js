import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branchmaster",
        required: true
    },

    mobile: String,
    address: String,

    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupMaster",
        required: true
    },

    activeStatus: {
        type: Boolean,
        default: true
    },

    createdOn: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("staffmaster", staffSchema, "staffmaster");
