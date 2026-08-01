import express from "express";
import { getSemesters, createSemester, updateSemester, deleteSemester } from "../controllers/gpaController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getSemesters).post(createSemester);
router.route("/:id").put(updateSemester).delete(deleteSemester);

export default router;
