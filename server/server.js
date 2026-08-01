import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import gpaRoutes from "./routes/gpaRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((o) => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "StudyVault API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/gpa", gpaRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Serve static frontend assets in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientDistPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) {
      next();
    }
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`StudyVault API listening on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

