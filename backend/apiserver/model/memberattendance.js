import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "membermaster",
      required: true,
      index: true,
    },

    checkIn: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },

    checkOut: {
      type: Date,
      default: null,
      index: true,
    },

    durationMinutes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["IN", "OUT"],
      default: "IN",
    },

    autoEnd: {
      type: Boolean,
      default: false,
    },

    autoEndReason: {
      type: String,
      default: null,
    },

    attendanceDate: {
      type: String, // YYYY-MM-DD
      index: true,
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branchmaster",
      index: true,
    },

    source: {
      type: String,
      enum: ["MANUAL", "BIOMETRIC", "SYSTEM"],
      default: "MANUAL",
    },

    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// 🔹 PRE-SAVE HOOK (for create & save)
attendanceSchema.pre("save", async function () {
  // Set attendanceDate
  if (this.checkIn) {
    const date = new Date(this.checkIn);
    this.attendanceDate = date.toISOString().split("T")[0];
  }

  // Calculate duration if checkout exists
  if (this.checkIn && this.checkOut) {
    const diff = (this.checkOut - this.checkIn) / (1000 * 60);
    this.durationMinutes = Math.max(0, Math.round(diff));
    this.status = "OUT";
  }
});

attendanceSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  const data = update.$set || update;

  // Get existing document
  const existing = await this.model.findOne(this.getQuery());

  const checkIn = data.checkIn || existing?.checkIn;
  const checkOut = data.checkOut;

  // Set attendanceDate if checkIn updated
  if (data.checkIn) {
    const date = new Date(data.checkIn);
    data.attendanceDate = date.toISOString().split("T")[0];
  }

  // ✅ Calculate duration when checkout comes
  if (checkIn && checkOut) {
    const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60);
    data.durationMinutes = Math.max(0, Math.round(diff));
    data.status = "OUT";
  }

  if (update.$set) {
    update.$set = data;
  }
});

// 🔹 INDEXES (important for reports & speed)
attendanceSchema.index({ memberId: 1, checkIn: -1 });
attendanceSchema.index({ attendanceDate: 1, branchId: 1 });
attendanceSchema.index({ status: 1 });

// 🔹 EXPORT
export default mongoose.model(
  "Attendance",
  attendanceSchema,
  "m_attendanceLog",
);
