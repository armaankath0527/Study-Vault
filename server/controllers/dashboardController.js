import Task from "../models/Task.js";
import ClassEntry from "../models/ClassEntry.js";
import AttendanceSubject from "../models/AttendanceSubject.js";
import Notice from "../models/Notice.js";
import Note from "../models/Note.js";
import GpaSemester from "../models/GpaSemester.js";
import CalendarEvent from "../models/CalendarEvent.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/dashboard
// One-shot aggregate fetch used right after login so the whole app can boot
// from a single request instead of firing one call per feature.
export const getDashboardSnapshot = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [tasks, timetable, attendanceSubjects, notices, notes, gpaSemesters, calendarEvents] = await Promise.all([
    Task.find({ user: userId }).sort({ due: 1 }),
    ClassEntry.find({ user: userId }).sort({ day: 1, start: 1 }),
    AttendanceSubject.find({ user: userId }),
    Notice.find({}).sort({ pinned: -1, date: -1 }).limit(100),
    Note.find({ user: userId }).sort({ updatedAt: -1 }),
    GpaSemester.find({ user: userId }).sort({ order: 1, createdAt: 1 }),
    CalendarEvent.find({ user: userId }).sort({ date: 1 }),
  ]);

  res.json({
    success: true,
    data: {
      profile: req.user.toPublicJSON(),
      tasks,
      timetable,
      attendance: attendanceSubjects,
      notices,
      notes,
      gpa: gpaSemesters,
      calendarEvents,
    },
  });
});
