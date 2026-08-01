import mongoose from "mongoose";

// One document per (user, subject) pair holding the running present/total tally
const attendanceSubjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    present: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

attendanceSubjectSchema.index({ user: 1, subject: 1 }, { unique: true });

export default mongoose.model("AttendanceSubject", attendanceSubjectSchema);
