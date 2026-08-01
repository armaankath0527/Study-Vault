import Notice from "../models/Notice.js";
import Notification from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/notices - shared campus board, visible to every authenticated user
export const getNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find({}).sort({ pinned: -1, date: -1 }).limit(100);
  res.json({ success: true, data: notices });
});

// @route POST /api/notices
export const createNotice = asyncHandler(async (req, res) => {
  const { title, body, pinned, date } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const notice = await Notice.create({
    postedBy: req.user._id,
    title,
    body: body || "",
    date: date || new Date().toISOString().slice(0, 10),
    pinned: !!pinned,
  });

  await Notification.create({
    user: null, // broadcast to all students
    type: "notice",
    title: "Notice board update",
    message: notice.title,
    date: notice.date,
    readBy: [req.user._id], // the poster has implicitly "seen" it
  });

  res.status(201).json({ success: true, data: notice });
});

// @route DELETE /api/notices/:id
export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) {
    res.status(404);
    throw new Error("Notice not found");
  }
  res.json({ success: true, data: { id: req.params.id } });
});
