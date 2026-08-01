import express from "express";
import { getNotices, createNotice, deleteNotice } from "../controllers/noticeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getNotices).post(createNotice);
router.route("/:id").delete(deleteNotice);

export default router;
