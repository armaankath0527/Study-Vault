import mongoose from "mongoose";

const classEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], required: true },
    start: { type: String, required: true }, // "HH:MM"
    end: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    room: { type: String, default: "" },
    color: { type: String, default: "#3B6FC4" },
  },
  { timestamps: true }
);

export default mongoose.model("ClassEntry", classEntrySchema);
