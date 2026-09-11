import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to robustly locate and load Gemini API key from all possible locations
function resolveGeminiApiKey(): string | null {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 10 && !process.env.GEMINI_API_KEY.includes("MY_GEMINI_API_KEY")) {
    return process.env.GEMINI_API_KEY.trim();
  }
  if (process.env.VITE_GEMINI_API_KEY && process.env.VITE_GEMINI_API_KEY.trim().length > 10) {
    return process.env.VITE_GEMINI_API_KEY.trim();
  }

  const candidateFiles = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "src", ".env"),
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "src", ".env"),
  ];

  for (const envFile of candidateFiles) {
    try {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, "utf-8");
        // Check for GEMINI_API_KEY=...
        const match = content.match(/GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/i);
        if (match && match[1] && match[1].trim().length > 10 && !match[1].includes("MY_GEMINI_API_KEY")) {
          const key = match[1].trim();
          process.env.GEMINI_API_KEY = key;
          return key;
        }
        // Check for raw API key string (e.g. starting with AQ. or AIza)
        const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        for (const line of lines) {
          if ((line.startsWith("AQ.") || line.startsWith("AIza")) && line.length > 20) {
            const cleanKey = line.replace(/["';]/g, "").trim();
            process.env.GEMINI_API_KEY = cleanKey;
            return cleanKey;
          }
        }
      }
    } catch {
      // Ignore file reading errors
    }
  }

  return null;
}

let aiClient: GoogleGenAI | null = null;
// Keep this list to models that are available to the API key used by this
// application. The previous 3.8/3.5 names do not exist, so image requests
// never reached Gemini Vision.
const VISION_MODELS = ["gemini-3.6-flash", "gemini-3-flash-preview"];
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = resolveGeminiApiKey();
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Seed category knowledge base
const SUPPORTED_CATEGORIES = [
  "Copper Wire",
  "Computer Motherboard",
  "Laptop",
  "Mobile Phone",
  "Circuit Board / PCB",
  "Aluminium Components",
  "Iron / Steel Casing",
  "RAM Modules",
  "Hard Disk Drive",
  "SSD",
  "SMPS / Power Supply",
  "Printer",
  "Charger / Adapter",
  "Battery",
  "Keyboard & Mouse",
  "Mixed Electronic Scrap",
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Allow larger payload for camera image captures
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    const activeKey = resolveGeminiApiKey();
    res.json({
      status: "ok",
      appName: "E-Waste Connect",
      hasGeminiKey: !!activeKey,
      activeModel: VISION_MODELS[0],
      timestamp: new Date().toISOString(),
    });
  });

  // AI E-waste Identification API
  app.post("/api/identify-ewaste", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg" } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided for analysis." });
      }

      // Clean base64 string if data URI header is present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z0-9.+-]+;base64,/i, "");
      const safeMimeType = /^image\/(jpeg|png|webp|gif)$/i.test(mimeType)
        ? mimeType.toLowerCase()
        : "image/jpeg";

      const gemini = getGeminiClient();

      if (gemini) {
        try {
          const prompt = `You are an expert e-waste identification AI for informal scrap collectors and formal recyclers in India.
Analyze this e-waste image and perform Cycle 2 Advanced E-Waste Identification.

Major E-Waste Categories:
- "Precious-Metal-Bearing Electronic Scrap"
- "Non-Ferrous Metals"
- "Ferrous Metals"
- "Computer Equipment"
- "Mobile & Personal Electronics"
- "Circuit Boards & Components"
- "Cables & Wiring"
- "Batteries"
- "Displays & TV"
- "Consumer Electronics & Appliances"
- "Telecom & Industrial Electronics"
- "Mixed E-Waste"

Subcategories include:
"Copper Wire", "Bare Copper", "Insulated Copper Cable", "Aluminium Components", "Brass", "Bronze", "Zinc / Lead / Tin",
"Iron / Steel Casing", "Stainless Steel", "Computer Motherboard", "Laptop", "Desktop Computer", "Server / Workstation",
"CPU / Processor", "GPU / Graphics Card", "RAM Modules", "Hard Disk Drive", "SSD", "SMPS / Power Supply",
"Mobile Phone", "Tablet / Smartwatch", "Phone Motherboard", "Circuit Board / PCB", "Electronic Components",
"Cables & Wiring", "Battery", "Lead-Acid Battery", "Displays / TV", "Printer", "Charger / Adapter", "Keyboard & Mouse",
"Telecom / Industrial Electronics", "Gold-bearing PCB", "Gold-plated contacts", "Silver-bearing components", "Mixed Electronic Scrap".

RULES:
1. BRAND RECOGNITION: Recognize visible brands (e.g. Apple, Samsung, Xiaomi, Redmi, OnePlus, Vivo, Oppo, Dell, HP, Lenovo, Acer, Asus, MSI, LG, Sony, Canon, Epson, Intel, AMD, Nvidia, Gigabyte, Kingston, Western Digital, Seagate). If no brand is visible, return "Unknown" or "Unbranded".
2. MODEL IDENTIFICATION: Identify product family / model ONLY if genuinely supported by the image (e.g. Apple -> iPhone 12, Dell -> Inspiron Series). DO NOT FABRICATE model numbers if not clearly visible. Use "Not confidently identified" if model is uncertain.
3. OCR / VISIBLE TEXT: Extract any text visible on logos, component labels, power ratings, part numbers (e.g. ["DELL 65W 19.5V", "Intel Core i7"]). Return as string array.
4. PRECIOUS METAL HANDLING: If gold-plated pins/fingers, silver contacts, or server/telecom PCBs are detected, set "isPreciousMetalBearing": true and "preciousMetalDisclaimer": "Potential precious-metal-bearing electronic scrap. Exact precious-metal content cannot be determined from an image. Professional assay required." DO NOT CLAIM exact grams of gold/silver.
5. CONFIDENCE: Provide realistic confidence (0-100), confidenceLevel ("HIGH", "MEDIUM", "LOW"), and a breakdown object for category, brand, model, material.

Return a strictly valid JSON object matching this structure:
{
  "detectedItem": "Clear summary description of identified scrap item",
  "category": "Major Category Name from list above",
  "subcategory": "Specific Subcategory Name from list above",
  "brand": "Brand name or 'Unknown'",
  "productFamily": "Product family name or 'Not specified'",
  "model": "Model name or 'Not confidently identified'",
  "visibleTextOCR": ["Text string 1", "Text string 2"],
  "confidence": 92,
  "confidenceLevel": "HIGH",
  "confidenceBreakdown": {
    "category": "HIGH",
    "brand": "HIGH",
    "model": "MEDIUM",
    "material": "HIGH"
  },
  "conditionAssessment": "Intact / Used / Damaged / Dismantled scrap grade",
  "potentialMaterials": "Key recoverable materials (e.g., copper, gold pins, aluminium, silicon)",
  "isPreciousMetalBearing": false,
  "preciousMetalDisclaimer": "",
  "isMixedScrap": false,
  "mixedItemsDetected": [],
  "safetyWarning": "Crucial safety instructions for handling",
  "valuationExplanation": "Brief justification of material valuation"
}
Do not invent physical weight or exact monetary value.`;

          console.log("[AI API] Sending image to Gemini Vision API...");
          const modelsToTry = VISION_MODELS;
          let response: any = null;
          let usedModel = modelsToTry[0];

          for (const modelName of modelsToTry) {
            try {
              response = await gemini.models.generateContent({
                model: modelName,
                contents: {
                  parts: [
                    {
                      inlineData: {
                        mimeType: safeMimeType,
                        data: cleanBase64,
                      },
                    },
                    {
                      text: prompt,
                    },
                  ],
                },
                config: {
                  responseMimeType: "application/json",
                },
              });
              usedModel = modelName;
              break;
            } catch (modelErr: any) {
              console.warn(`[AI API] Model ${modelName} failed or unavailable:`, modelErr?.message || modelErr);
            }
          }

          if (response) {
            const rawText = response.text || "{}";
            const parsed = JSON.parse(rawText);
            if (!parsed.detectedItem || !parsed.category || !parsed.confidence) {
              throw new Error("Gemini returned an incomplete identification result.");
            }
            console.log(`[AI API] Successfully identified e-waste with ${usedModel}:`, parsed.detectedItem);
            return res.json({
              success: true,
              provider: `Gemini Vision AI (${usedModel})`,
              data: parsed,
            });
          }
        } catch (apiError: any) {
          console.error("[AI API] Gemini Vision call failed:", apiError?.message);
          return res.status(502).json({
            error: "Vision service could not analyze this image.",
            code: "VISION_ANALYSIS_FAILED",
          });
        }
      } else {
        return res.status(503).json({
          error: "Vision service is not configured. Add GEMINI_API_KEY to the server environment.",
          code: "VISION_NOT_CONFIGURED",
        });
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      return res.status(500).json({
        error: "Failed to analyze image",
        details: err?.message || "Unknown error",
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`E-Waste Connect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
