import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branchmaster",
      required: true,
      index: true,
    },

    discountname: {
      type: String,
      required: true,
      index: true,
    },

    activestatus: {
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

export default mongoose.model(
  "discountmaster",
  discountSchema,
  "discountmaster",
);
