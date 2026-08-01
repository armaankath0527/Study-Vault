import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    credits: { type: Number, default: 3 },
    marks: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 100 },
  },
  { _id: true }
);

const gpaSemesterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    courses: { type: [courseSchema], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("GpaSemester", gpaSemesterSchema);
