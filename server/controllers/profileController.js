import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @route GET /api/profile
export const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toPublicJSON() });
});

// @route PUT /api/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const fields = ["name", "email", "year", "semester", "avatarColor", "darkMode"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) req.user[f] = req.body[f];
  });
  await req.user.save();
  res.json({ success: true, data: req.user.toPublicJSON() });
});

// @route PUT /api/profile/password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current and new password are required");
  }
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id).select("+password");
  const matches = await user.matchPassword(currentPassword);
  if (!matches) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated successfully" });
});
