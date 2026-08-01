import mongoose from "mongoose";

// Notice board is shared across all students - postedBy just tracks attribution
const noticeSchema = new mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, default: "" },
    date: { type: String, required: true },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
