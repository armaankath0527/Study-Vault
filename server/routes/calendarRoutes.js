import express from "express";
import { getCalendarEvents, createCalendarEvent, deleteCalendarEvent } from "../controllers/calendarController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getCalendarEvents).post(createCalendarEvent);
router.route("/:id").delete(deleteCalendarEvent);

export default router;
