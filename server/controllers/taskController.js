import Task from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function bumpStreak(user) {
  const today = new Date().toISOString().slice(0, 10);
  if (user.streaks.lastActiveDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  user.streaks.current = user.streaks.lastActiveDate === yesterday ? user.streaks.current + 1 : 1;
  user.streaks.best = Math.max(user.streaks.best, user.streaks.current);
  user.streaks.lastActiveDate = today;
}

// @route GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ due: 1 });
  res.json({ success: true, data: tasks });
});

// @route POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, subject, due, priority } = req.body;
  if (!title || !due) {
    res.status(400);
    throw new Error("Title and due date are required");
  }
  const task = await Task.create({
    user: req.user._id,
    title,
    subject: subject || "General",
    due,
    priority: priority || "Medium",
    status: "pending",
  });
  res.status(201).json({ success: true, data: task });
});

// @route PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  const wasDone = task.status === "done";
  const fields = ["title", "subject", "due", "priority", "status"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) task[f] = req.body[f];
  });
  await task.save();

  let streaks = null;
  if (!wasDone && task.status === "done") {
    bumpStreak(req.user);
    await req.user.save();
    streaks = req.user.streaks;
  }

  res.json({ success: true, data: task, streaks });
});

// @route DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.json({ success: true, data: { id: req.params.id } });
});
