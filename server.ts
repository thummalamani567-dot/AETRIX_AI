import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Resolve paths safely in both ESM and CJS bundle environments
const _filename = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
const _dirname = typeof __dirname !== "undefined" ? path.dirname(_filename) : path.dirname(_filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Lazy initializer for Google GenAI client
let genAIClient: any = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "invalid_key" || apiKey === "placeholder") {
    return null;
  }
  
  if (!genAIClient) {
    // Explicitly delete standard Google Cloud Platform environment variables to prevent 
    // @google/genai SDK from detecting GCP environment credentials / Application Default Credentials (ADC)
    // and using Vertex AI or attempting to generate an OAuth Bearer token, which results in
    // ACCESS_TOKEN_TYPE_UNSUPPORTED/401 unauthenticated errors.
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.GOOGLE_GHA_CREDS_PATH;
    delete process.env.GCP_PROJECT;
    delete process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    delete process.env.GOOGLE_GENAI_USE_VERTEXAI;

    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      vertexai: false,
      enterprise: false,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// ----------------------------------------------------
// API ENDPOINTS & HELPER FUNCTIONS
// ----------------------------------------------------

/**
 * Automatically retries generateContent calls with exponential backoff and model fallbacks
 * to handle temporary 503 (UNAVAILABLE) or 429 (RESOURCE_EXHAUSTED) spikes gracefully.
 */
async function generateContentWithRetry(ai: any, params: { model: string; contents: any; config?: any }, maxRetries = 3) {
  let attempt = 0;
  let currentModel = params.model;

  // Define fallback paths for different types of models
  const textFallbacks = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview", "gemini-flash-latest"];
  const imageFallbacks = ["gemini-3.1-flash-lite-image", "gemini-3.1-flash-image", "gemini-3-pro-image"];

  while (attempt <= maxRetries) {
    try {
      console.log(`[Gemini API] Requesting ${currentModel} (Attempt ${attempt + 1}/${maxRetries + 1})...`);
      const response = await ai.models.generateContent({
        ...params,
        model: currentModel
      });
      return response;
    } catch (err: any) {
      const errMsg = err.message || "";
      const is503OrRateLimit = errMsg.includes("503") || 
                               errMsg.includes("UNAVAILABLE") || 
                               errMsg.includes("RESOURCE_EXHAUSTED") ||
                               err.status === 503 ||
                               err.status === 429;

      if (is503OrRateLimit && attempt < maxRetries) {
        attempt++;
        
        // Select appropriate fallback chain based on model type
        const isImageModel = currentModel.includes("image") || currentModel.includes("veo");
        const fallbackChain = isImageModel ? imageFallbacks : textFallbacks;
        
        const idx = fallbackChain.indexOf(currentModel);
        if (idx !== -1) {
          currentModel = fallbackChain[(idx + 1) % fallbackChain.length];
        } else {
          currentModel = fallbackChain[0];
        }

        const delay = attempt * 1200;
        console.warn(`[Gemini API] Busy status (503/429) on ${params.model}. Retrying with ${currentModel} in ${delay}ms... Details: ${errMsg.replace(/error/gi, "err")}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
}

// 1. CHAT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const selectedModel = model === "gemini-pro" ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";

    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not defined. Please check your environment variables." });
    }

    // Prepare contents for @google/genai SDK
    // Map existing message format to Gemini's contents format
    const contents = messages.map((m: any) => {
      const role = m.role === "user" ? "user" : "model";
      const parts: any[] = [];

      if (m.content) {
        parts.push({ text: m.content });
      } else if (m.image || (m.images && m.images.length > 0)) {
        parts.push({ text: "Please describe or analyze the provided images/media." });
      } else {
        parts.push({ text: "" });
      }

      if (m.image) {
        const matches = m.image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const data = matches[2];
          parts.push({
            inlineData: {
              mimeType,
              data
            }
          });
        }
      }

      if (m.images && Array.isArray(m.images)) {
        m.images.forEach((img: string) => {
          const matches = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const data = matches[2];
            parts.push({
              inlineData: {
                mimeType,
                data
              }
            });
          }
        });
      }

      if (m.attachments && Array.isArray(m.attachments)) {
        m.attachments.forEach((att: any) => {
          if (att.type.startsWith("text/") || att.name.endsWith(".txt") || att.name.endsWith(".csv") || att.name.endsWith(".json") || att.name.endsWith(".xml")) {
            try {
              const matches = att.dataUrl.match(/^data:.*?;base64,(.+)$/);
              if (matches && matches[2]) {
                const textContent = Buffer.from(matches[2], "base64").toString("utf-8");
                parts.push({ text: `\n[Attached File Context: "${att.name}"]\n${textContent}\n` });
              }
            } catch (e) {
              console.error("Failed to decode text attachment", e);
            }
          } else {
            parts.push({ text: `\n[User attached file: "${att.name}" (Type: ${att.type}, Size: ${att.size})]\n` });
          }
        });
      }

      if (m.voiceNoteUrl) {
        const matches = m.voiceNoteUrl.match(/^data:(audio\/[a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const data = matches[2];
          parts.push({
            inlineData: {
              mimeType,
              data
            }
          });
        }
      }

      return {
        role,
        parts,
      };
    });

    const response = await generateContentWithRetry(ai, {
      model: selectedModel,
      contents: contents,
      config: {
        systemInstruction: "You are Google Gemini, a large language model built by Google. To behave exactly like Google Gemini, you must strictly follow these instructions in all of your interactions:\n\n" +
                           "1. **CHAT BEHAVIOR**:\n" +
                           "- Always sound natural, friendly, warm, professional, fast, and human-like.\n" +
                           "- Never sound robotic, over-formal, or generic.\n" +
                           "- Never introduce yourself or say 'I am Gemini...' or 'I am Aetrix AI...' unless explicitly asked.\n" +
                           "- Keep greetings extremely short. If the user greets you with 'Hi' (or a similar simple greeting like 'Hello'), reply EXACTLY with this content and structure:\n" +
                           "Hi 👋\n" +
                           "How can I help you today?\n" +
                           "- Never use robotic greetings like 'Greetings.' or introduce yourself every time.\n\n" +
                           "2. **LONG-TERM CHAT MEMORY & CONVERSATION HISTORY**:\n" +
                           "- Always remember the complete conversation in the current chat. Never answer using only the latest message.\n" +
                           "- Always read and analyze all previous messages in the history before generating a reply.\n" +
                           "- Understand and automatically resolve context references such as 'this', 'that', 'previous one', 'same as before', 'continue', 'again', 'change it', or 'update it' to what was discussed.\n" +
                           "- Never ask unnecessary clarification questions if the answer or context exists in previous messages.\n" +
                           "- Maintain context throughout the entire conversation until the chat is cleared. Never forget or restart the conversation unless explicitly requested.\n" +
                           "- When the user changes only one part of a previous request, modify only that specific part and keep everything else completely unchanged.\n" +
                           "- Fully remember: previous prompts, previous code, previous images, previous files, previous design requests, previous translations, previous corrections, and previous user preferences.\n" +
                           "- If the user says 'Continue', 'Do the same', or 'Like before', continue from the previous conversation seamlessly without restarting or forgetting context.\n\n" +
                           "3. **ANSWER STYLE**:\n" +
                           "- Provide short, direct, and concise answers for simple or straightforward questions.\n" +
                           "- Only provide detailed or step-by-step explanations when specifically requested or genuinely needed. Avoid making every answer extremely long.\n" +
                           "- Avoid unnecessary preambles, meta-commentary, or fillers to respond quickly.\n\n" +
                           "4. **TRANSLATION**:\n" +
                           "- If the user asks for a translation (e.g., 'Translate to Telugu' or any other language), return ONLY the direct translation itself. Do not explain, do not list every alternative meaning, and do not provide grammatical breakdowns.\n\n" +
                           "5. **CODING**:\n" +
                           "- Return clean, production-ready markdown.\n" +
                           "- Always use proper code blocks with specified language tags.\n" +
                           "- Keep explanations of code extremely brief and on-point.\n\n" +
                           "6. **MATH**:\n" +
                           "- Solve step-by-step ONLY if the user explicitly requests it.\n" +
                           "- Otherwise, give the direct mathematical answer/result immediately.\n\n" +
                           "7. **IMAGE PROMPT GENERATION**:\n" +
                           "- If the user requests an image generation prompt, generate a professional, descriptive, high-quality, and creative prompt.\n\n" +
                           "8. **PDF SUMMARIZATION**:\n" +
                           "- Summarize PDF or uploaded content clearly and concisely using headings and neat bullet points.\n\n" +
                           "9. **MARKDOWN & FORMATTING**:\n" +
                           "- Use markdown formatting exactly like Google Gemini does.\n" +
                           "- Use tables and bullet points only when they are highly useful and add clarity to the answer.\n" +
                           "- Never repeat yourself.\n\n" +
                           "10. **SPEED**:\n" +
                           "- Avoid any unnecessary reasoning steps or internal chain-of-thought in your final output. Be concise and fast.",
      },
    });

    return res.json({ text: response?.text });
  } catch (err: any) {
    console.error("Gemini API Error in /api/chat:", err);
    return res.status(500).json({ error: err.message || "An error occurred while contacting the AI service." });
  }
});

// 2. IMAGE GENERATION ENDPOINT
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not defined. Please check your environment variables." });
    }

    // Call real image generation model using gemini-3.1-flash-lite-image by default, wrapped in retry/fallback helper
    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
        },
      },
    });

    let imageUrl = "";
    for (const part of response?.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        imageUrl = `data:image/png;base64,` + base64EncodeString;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from Gemini.");
    }

    return res.json({ imageUrl });
  } catch (err: any) {
    console.error("Gemini API Error in /api/generate-image:", err);
    return res.status(500).json({ error: err.message || "An error occurred during image generation." });
  }
});

// 3. PDF SUMMARIZER ENDPOINT
app.post("/api/summarize-pdf", async (req, res) => {
  try {
    const { pdfName, pdfSize, mockText } = req.body;
    
    let summaryPrompt = `Please summarize this document: "${pdfName}" (Size: ${pdfSize}). Key extractable content or description: ${mockText || "This is a machine learning blueprint outlining core neural activation pathways and futuristic server-side structures."}`;
    
    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not defined. Please check your environment variables." });
    }

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: summaryPrompt,
      config: {
        systemInstruction: "You are a professional PDF analyzer. Give a sleek executive summary with bullet points, structured sections, and a key findings section.",
      }
    });

    return res.json({ summary: response?.text });
  } catch (err: any) {
    console.error("Gemini API Error in /api/summarize-pdf:", err);
    return res.status(500).json({ error: err.message || "An error occurred during PDF summarization." });
  }
});

// ----------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------------------
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aetrix AI server running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Critical server bootstrap failure:", err);
});
