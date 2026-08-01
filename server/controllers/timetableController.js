import ClassEntry from "../models/ClassEntry.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/timetable
export const getTimetable = asyncHandler(async (req, res) => {
  const classes = await ClassEntry.find({ user: req.user._id }).sort({ day: 1, start: 1 });
  res.json({ success: true, data: classes });
});

// @route POST /api/timetable
export const createClass = asyncHandler(async (req, res) => {
  const { day, start, end, subject, room, color } = req.body;
  if (!day || !start || !end || !subject) {
    res.status(400);
    throw new Error("Day, start time, end time and subject are required");
  }
  const entry = await ClassEntry.create({ user: req.user._id, day, start, end, subject, room, color });
  res.status(201).json({ success: true, data: entry });
});

// @route PUT /api/timetable/:id
export const updateClass = asyncHandler(async (req, res) => {
  const entry = await ClassEntry.findOne({ _id: req.params.id, user: req.user._id });
  if (!entry) {
    res.status(404);
    throw new Error("Class not found");
  }
  const fields = ["day", "start", "end", "subject", "room", "color"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) entry[f] = req.body[f];
  });
  await entry.save();
  res.json({ success: true, data: entry });
});

// @route DELETE /api/timetable/:id
export const deleteClass = asyncHandler(async (req, res) => {
  const entry = await ClassEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!entry) {
    res.status(404);
    throw new Error("Class not found");
  }
  res.json({ success: true, data: { id: req.params.id } });
});
