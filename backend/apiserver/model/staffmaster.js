import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branchmaster",
    required: true,
  },

  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  address: {
    type: String,
    trim: true,
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupMaster",
    required: true,
  },

  activeStatus: {
    type: Boolean,
    default: true,
  },

  createdOn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("staffmaster", staffSchema, "staffmaster");
