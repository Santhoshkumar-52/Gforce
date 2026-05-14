import mongoose from "mongoose";

const gstSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branchmaster",
      required: true,
      index: true,
    },

    gstname: {
      type: String,
      required: true,
      index: true,
    },

    value: {
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
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  },
);

export default mongoose.model("gstmaster", gstSchema, "gstmaster");
