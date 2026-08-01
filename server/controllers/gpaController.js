import GpaSemester from "../models/GpaSemester.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/gpa
export const getSemesters = asyncHandler(async (req, res) => {
  const semesters = await GpaSemester.find({ user: req.user._id }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: semesters });
});

// @route POST /api/gpa
export const createSemester = asyncHandler(async (req, res) => {
  const count = await GpaSemester.countDocuments({ user: req.user._id });
  const semester = await GpaSemester.create({
    user: req.user._id,
    name: req.body.name || `Semester ${count + 1}`,
    courses: req.body.courses || [],
    order: count,
  });
  res.status(201).json({ success: true, data: semester });
});

// @route PUT /api/gpa/:id
export const updateSemester = asyncHandler(async (req, res) => {
  const semester = await GpaSemester.findOne({ _id: req.params.id, user: req.user._id });
  if (!semester) {
    res.status(404);
    throw new Error("Semester not found");
  }
  if (req.body.name !== undefined) semester.name = req.body.name;
  if (req.body.courses !== undefined) semester.courses = req.body.courses;
  await semester.save();
  res.json({ success: true, data: semester });
});

// @route DELETE /api/gpa/:id
export const deleteSemester = asyncHandler(async (req, res) => {
  const semester = await GpaSemester.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!semester) {
    res.status(404);
    throw new Error("Semester not found");
  }
  res.json({ success: true, data: { id: req.params.id } });
});
