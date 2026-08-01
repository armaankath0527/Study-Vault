import CalendarEvent from "../models/CalendarEvent.js";
import Task from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/calendar
export const getCalendarEvents = asyncHandler(async (req, res) => {
  const events = await CalendarEvent.find({ user: req.user._id }).sort({ date: 1 });
  res.json({ success: true, data: events });
});

// @route POST /api/calendar
// If type === "Task", a matching Task document is created and linked, so it
// automatically shows up in the Tasks tab too.
export const createCalendarEvent = asyncHandler(async (req, res) => {
  const { date, type, label, priority } = req.body;
  if (!date || !label) {
    res.status(400);
    throw new Error("Date and title are required");
  }

  let linkedTask = null;
  if (type === "Task") {
    linkedTask = await Task.create({
      user: req.user._id,
      title: label,
      subject: "General",
      due: date,
      priority: priority || "Medium",
      status: "pending",
    });
  }

  const event = await CalendarEvent.create({
    user: req.user._id,
    date,
    type: type || "Personal",
    label,
    linkedTask: linkedTask ? linkedTask._id : null,
  });

  res.status(201).json({ success: true, data: { event, task: linkedTask } });
});

// @route DELETE /api/calendar/:id
export const deleteCalendarEvent = asyncHandler(async (req, res) => {
  const event = await CalendarEvent.findOne({ _id: req.params.id, user: req.user._id });
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (event.linkedTask) {
    await Task.findByIdAndDelete(event.linkedTask);
  }
  await event.deleteOne();
  res.json({ success: true, data: { id: req.params.id } });
});
