import Note from "../models/Note.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/notes
export const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json({ success: true, data: notes });
});

// @route POST /api/notes
export const createNote = asyncHandler(async (req, res) => {
  const { title, body, tag } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }
  const note = await Note.create({ user: req.user._id, title, body: body || "", tag: tag || "" });
  res.status(201).json({ success: true, data: note });
});

// @route PUT /api/notes/:id
export const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  ["title", "body", "tag"].forEach((f) => {
    if (req.body[f] !== undefined) note[f] = req.body[f];
  });
  await note.save();
  res.json({ success: true, data: note });
});

// @route DELETE /api/notes/:id
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  res.json({ success: true, data: { id: req.params.id } });
});
