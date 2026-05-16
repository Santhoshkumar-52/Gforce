import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
    staffId: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
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

export default mongoose.model("LoginMaster", loginSchema,"loginmaster");
