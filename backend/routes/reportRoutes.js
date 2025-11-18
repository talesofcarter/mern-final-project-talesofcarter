import express from "express";
import {
  getAllReports,
  getReportById,
  getSuppliers,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const reportRouter = express.Router();

reportRouter.use(protect);

reportRouter.get("/", getAllReports);
reportRouter.get("/:id", getReportById);
reportRouter.get("/suppliers/list", getSuppliers);

export default reportRouter;
