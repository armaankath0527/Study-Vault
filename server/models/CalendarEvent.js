import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true }, // ISO date string YYYY-MM-DD
    type: { type: String, enum: ["Personal", "Task"], default: "Personal" },
    label: { type: String, required: true, trim: true },
    // if this event also created a Task, keep a reference so the two stay in sync
    linkedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("CalendarEvent", calendarEventSchema);
