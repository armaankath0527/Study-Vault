import mongoose from "mongoose";

// Stored (persisted) notifications - e.g. generated when a notice is posted.
// user = null means it is broadcast to every student.
const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, enum: ["notice", "task", "attendance", "streak", "system"], default: "system" },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    date: { type: String, required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
