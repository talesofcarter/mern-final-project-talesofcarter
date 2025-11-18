import axios from "axios";
import mongoose from "mongoose";
import Report from "../models/Report.js";

const API_URL = "https://router.huggingface.co/v1/chat/completions";
const MODEL_ID = "openai/gpt-oss-120b:together";

const callHuggingFaceLLM = async (prompt) => {
  if (!process.env.HF_TOKEN) {
    console.error("Hugging Face API token not set");
    throw new Error("Hugging Face API token not configured.");
  }

  const headers = {
    Authorization: `Bearer ${process.env.HF_TOKEN}`,
    "Content-Type": "application/json",
  };

  const payload = {
    model: MODEL_ID,
    messages: [
      {
        role: "system",
        content:
          "You are an advanced procurement sustainability AI a specialist in procurement sustainability, supply chain risk analysis, and ESG benchmarking. Your sole task is to generate ONLY a single valid JSON object containing the full supplier analysis. Your sole task is to perform an analysis of the supplier and respond with ONLY a single, valid JSON object containing the full report. DO NOT include any explanatory text, greetings, or markdown formatting outside of the JSON object itself",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 2000,
    temperature: 0.5,
  };

  try {
    const response = await axios.post(API_URL, payload, {
      headers,
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to call Hugging Face LLM:", error.message);
    if (error.response) console.log(error.response.data);
    throw new Error("Failed to reach the AI analysis service.");
  }
};

// Clean and parse LLM output
const cleanAndParseJson = (llmOutputText) => {
  const match = llmOutputText.match(/{[\s\S]*}/);
  if (!match) {
    console.error("No JSON object found in LLM output:", llmOutputText);
    return null;
  }

  try {
    const parsed = JSON.parse(match[0]);
    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON:", err.message);
    console.log("Attempted JSON:", match[0]);
    return null;
  }
};

// Analyze Supplier
export const analyzeSupplier = async (req, res) => {
  try {
    const { supplierName, industry, responses } = req.body;
    const userId = req.user;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated." });
    }

    if (!supplierName || !industry || !responses) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    // 1. Construct prompt
    const prompt = `
      You are an expert AI in sustainable procurement, ESG analysis, and supplier risk management.

      Analyze the supplier based on the data below and generate a structured JSON report. Include numeric and textual insights, actionable recommendations, and benchmarking. Ensure the recommendations and suggestions are as descriptive as possible. Give a brief overview of how Fortune 500 companies in the same industry as doing, just to enrich the context of insights.

      Supplier Name: "${supplierName}"
      Industry: "${industry}"
      Responses: ${JSON.stringify(responses, null, 2)}

      Return ONLY a single JSON object with the following keys:

      1. "supplierName" - Supplier name
      2. "industry" - Industry
      3. "environment" - {
          "scope1": number (tCO2e),
          "scope2": number (tCO2e),
          "scope3": number (tCO2e),
          "carbonIntensityScore": number (0-100),
          "co2SavingsPotential": number (tCO2e),
          "summary": string
        }
      4. "esg" - {
          "environmental": number (0-100),
          "social": number (0-100),
          "governance": number (0-100),
          "overallRating": string (A-E)
        }
      5. "risk" - {
          "riskScore": number (1-10),
          "breakdown": object,
          "redFlags": array of strings
        }
      6. "spendInsights" - {
          "inefficiencyEstimate": string,
          "fortune500Comparison": string,
          "improvementSuggestions": array of strings
        }
      7. "diversity" - {
          "diversityScore": number (0-100),
          "complianceSummary": string,
          "recommendations": array of strings
        }
      8. "benchmarking" - {
          "industryPositionPercentile": number,
          "fortune500Averages": object
        }
      9. "finalRecommendation" - string ("Go", "Conditional Go", "Do Not Proceed") with brief plan

      Important:
      - Return valid JSON ONLY.
      - Include numeric values, percentages, and text explanations.
      - Provide actionable insights and compare to industry standards.
      `;

    // 2. Call the AI
    const apiResponse = await callHuggingFaceLLM(prompt);

    if (!apiResponse?.choices?.length) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI response structure.",
      });
    }

    // 3. Extract & parse content
    const generatedText = apiResponse.choices[0]?.message?.content;
    if (!generatedText) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty content.",
      });
    }

    const analysisResult = cleanAndParseJson(generatedText);
    if (!analysisResult) {
      return res.status(500).json({
        success: false,
        message: "AI returned unexpected format. Ensure JSON-only output.",
      });
    }

    // 4. Save report to DB
    const newReport = await Report.create({
      userId: new mongoose.Types.ObjectId(userId),
      supplierName,
      industry,
      responses,
      aiOutput: analysisResult,
    });

    // 5. Send concise summary to frontend
    const summary = `Analysis Complete! ESG Overall: ${
      analysisResult.esg?.overallRating || "N/A"
    }, Risk Score: ${analysisResult.risk?.riskScore || "N/A"}.`;

    res.status(200).json({
      success: true,
      summary,
      fullReport: newReport,
    });
  } catch (error) {
    console.error("Analyze Supplier Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
