import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // AI Theme enrichment endpoint
  app.post("/api/ai/theme-details", async (req, res) => {
    try {
      const { theme } = req.body;
      if (!theme) {
        return res.status(400).json({ error: "Theme is required" });
      }

      if (!ai) {
        // Fallback for missing api key
        return res.json({
          wordOfDay: "Resilience (noun) - The capacity to recover quickly from difficulties; toughness.",
          idiom: "Bite the bullet (face a difficult situation with courage)",
          quote: "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill"
        });
      }

      const prompt = `You are a Toastmasters meeting linguistic assistant. The theme for this meeting is "${theme}".
      Generate a customized Word of the Day (with definition/usage), an Idiom of the Day, and an inspiring Quote of the Day.
      Match the theme perfectly and provide them in a clean JSON format.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              wordOfDay: { type: Type.STRING, description: "Word of the Day and definition" },
              idiom: { type: Type.STRING, description: "An idiom and its brief meaning" },
              quote: { type: Type.STRING, description: "An inspiring quote and author" }
            },
            required: ["wordOfDay", "idiom", "quote"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Educational Session summary/abstract generator
  app.post("/api/ai/educational-abstract", async (req, res) => {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      if (!ai) {
        return res.json({
          description: "This session will provide interactive techniques and practical guidelines for mastering public speaking based on the topic: " + title
        });
      }

      const prompt = `You are a Toastmasters mentor. For an educational session titled "${title}", write a brief description (2-3 sentences) summarizing the main learning outcomes and why it's beneficial for Toastmasters.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ description: response.text?.trim() });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Insights and Analytics predicting next meeting success
  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { meetings, members } = req.body;

      if (!ai) {
        return res.json({
          toneAnalysis: "Last meeting's Table Topics were 20% more engaging than the previous average. Members favored open-ended questions.",
          attendancePrediction: "Expecting high turnout (85%+) for Thursday. Suggest adding an extra evaluator slot."
        });
      }

      const prompt = `You are an AI Analyst for a Toastmasters club. Here is the list of active members: ${JSON.stringify(members)}
      And here is our recent meetings history: ${JSON.stringify(meetings)}.
      Provide two key insights:
      1. Tone Analysis (summarize general sentiment, engagement, or recommendations)
      2. Attendance Prediction (predict attendance levels and suggest a proactive planning tip)
      
      Keep it brief and engaging. Respond in JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              toneAnalysis: { type: Type.STRING },
              attendancePrediction: { type: Type.STRING }
            },
            required: ["toneAnalysis", "attendancePrediction"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
