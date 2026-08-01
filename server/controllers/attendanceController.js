import AttendanceSubject from "../models/AttendanceSubject.js";
import AttendanceLog from "../models/AttendanceLog.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/attendance
export const getAttendance = asyncHandler(async (req, res) => {
  const subjects = await AttendanceSubject.find({ user: req.user._id });
  const log = await AttendanceLog.find({ user: req.user._id }).sort({ date: -1 }).limit(200);
  res.json({ success: true, data: { subjects, log } });
});

// @route PUT /api/attendance/:subject
// Marks today's attendance (present/absent) for a subject, creating the subject
// tally document on first use.
export const markAttendance = asyncHandler(async (req, res) => {
  const { subject } = req.params;
  const { present, date } = req.body;
  if (typeof present !== "boolean") {
    res.status(400);
    throw new Error("`present` (boolean) is required");
  }

  let record = await AttendanceSubject.findOne({ user: req.user._id, subject });
  if (!record) {
    record = await AttendanceSubject.create({ user: req.user._id, subject, present: 0, total: 0 });
  }
  record.total += 1;
  if (present) record.present += 1;
  await record.save();

  const logEntry = await AttendanceLog.create({
    user: req.user._id,
    subject,
    date: date || new Date().toISOString().slice(0, 10),
    present,
  });

  res.json({ success: true, data: { subject: record, log: logEntry } });
});

// @route DELETE /api/attendance/:subject
export const deleteAttendanceSubject = asyncHandler(async (req, res) => {
  await AttendanceSubject.findOneAndDelete({ user: req.user._id, subject: req.params.subject });
  res.json({ success: true, data: { subject: req.params.subject } });
});
