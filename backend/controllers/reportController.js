import mongoose from "mongoose";
import Report from "../models/Report.js";

// Get all reports for the logged-in user
export const getAllReports = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User identifier missing." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const reports = await Report.find({ userId: userObjectId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid report ID" });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    const requestUserId = new mongoose.Types.ObjectId(req.user);

    if (!report.userId.equals(requestUserId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSuppliers = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User identifier missing." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const suppliers = await Report.find({ userId: userObjectId }).distinct(
      "supplierName"
    );

    res.status(200).json({ success: true, suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
