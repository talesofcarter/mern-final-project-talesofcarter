import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplierName: String,
    industry: String,
    responses: Object,
    aiOutput: Object,
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
