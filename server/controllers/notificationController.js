import Task from "../models/Task.js";
import AttendanceSubject from "../models/AttendanceSubject.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function buildVirtualNotifications(user) {
  const today = new Date().toISOString().slice(0, 10);
  const items = [];

  const dueToday = await Task.find({ user: user._id, status: { $ne: "done" }, due: today });
  dueToday.forEach((t) =>
    items.push({ id: `task-${t._id}`, type: "task", title: "Task due today", message: t.title, date: today })
  );

  const subjects = await AttendanceSubject.find({ user: user._id });
  subjects.forEach((s) => {
    const pct = s.total ? (s.present / s.total) * 100 : 100;
    if (pct < 75) {
      items.push({
        id: `att-${s.subject}`,
        type: "attendance",
        title: "Low attendance",
        message: `${s.subject}: ${pct.toFixed(1)}% — below 75%`,
        date: today,
      });
    }
  });

  if (user.streaks.current > 0 && [3, 7, 14, 30].includes(user.streaks.current)) {
    items.push({
      id: `streak-${user.streaks.current}`,
      type: "streak",
      title: "Streak milestone!",
      message: `${user.streaks.current}-day productivity streak 🔥`,
      date: today,
    });
  }

  return items;
}

// @route GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const virtual = await buildVirtualNotifications(req.user);

  const stored = await Notification.find({
    $or: [{ user: req.user._id }, { user: null }],
  })
    .sort({ createdAt: -1 })
    .limit(30);

  const storedFormatted = stored.map((n) => ({
    id: n._id.toString(),
    type: n.type,
    title: n.title,
    message: n.message,
    date: n.date,
    read: n.readBy.some((id) => id.toString() === req.user._id.toString()),
  }));

  const virtualFormatted = virtual.map((n) => ({
    ...n,
    read: req.user.notificationsRead.includes(n.id),
  }));

  const combined = [...virtualFormatted, ...storedFormatted].sort((a, b) => (a.date < b.date ? 1 : -1));

  res.json({ success: true, data: combined });
});

// @route PUT /api/notifications/read-all
export const markAllRead = asyncHandler(async (req, res) => {
  const virtual = await buildVirtualNotifications(req.user);
  const virtualIds = virtual.map((n) => n.id);
  req.user.notificationsRead = Array.from(new Set([...req.user.notificationsRead, ...virtualIds]));
  await req.user.save();

  await Notification.updateMany(
    { $or: [{ user: req.user._id }, { user: null }], readBy: { $ne: req.user._id } },
    { $push: { readBy: req.user._id } }
  );

  res.json({ success: true, message: "All notifications marked as read" });
});
