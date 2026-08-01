import mongoose from "mongoose";

// Individual mark-present/absent events, used for trend charts and history
const attendanceLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true },
    date: { type: String, required: true }, // ISO date string
    present: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AttendanceLog", attendanceLogSchema);
