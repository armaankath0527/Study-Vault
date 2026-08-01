import express from "express";
import { getTimetable, createClass, updateClass, deleteClass } from "../controllers/timetableController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getTimetable).post(createClass);
router.route("/:id").put(updateClass).delete(deleteClass);

export default router;
