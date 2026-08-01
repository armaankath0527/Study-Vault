import express from "express";
import { getAttendance, markAttendance, deleteAttendanceSubject } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/", getAttendance);
router.route("/:subject").put(markAttendance).delete(deleteAttendanceSubject);

export default router;
