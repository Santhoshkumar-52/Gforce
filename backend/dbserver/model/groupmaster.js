import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        unique: true
    },
    description: String,

    activeStatus: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("GroupMaster", groupSchema,"groupmaster");
