import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    year: { type: String, default: "1st Year" },
    semester: { type: String, default: "Semester 1" },
    avatarColor: { type: String, default: "#2F6F4E" },
    darkMode: { type: Boolean, default: false },
    streaks: {
      current: { type: Number, default: 0 },
      best: { type: Number, default: 0 },
      lastActiveDate: { type: String, default: null }, // ISO date string (YYYY-MM-DD)
    },
    // Ids of "virtual" (computed) notifications the user has already dismissed
    notificationsRead: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    year: this.year,
    semester: this.semester,
    avatarColor: this.avatarColor,
    darkMode: this.darkMode,
    streaks: this.streaks,
  };
};

export default mongoose.model("User", userSchema);
