import express from "express";
import { analyzeSupplier } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const aiRoutes = express.Router();

aiRoutes.post("/analyze", protect, analyzeSupplier);

export default aiRoutes;
