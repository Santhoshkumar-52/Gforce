import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true
    },
    branchid: {
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

export default mongoose.model("StaffMaster", staffSchema, "staffmaster");
