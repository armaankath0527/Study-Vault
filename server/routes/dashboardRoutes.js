import express from "express";
import { getDashboardSnapshot } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getDashboardSnapshot);

export default router;
