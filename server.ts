import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in the environment variables!");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Model system instructions
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  gemini: "Siz Google tomonidan yaratilgan Gemini 1.5 Flash modelsiz. Siz mutlaqo bepul (tekin), juda ham tezkor va samarali muloqot qila oladigan yordamchisiz. Javobingizni har doim o'zbek tilida chiroyli tarzda taqdim eting.",
  "gemini-pro": "Siz Google kompaniyasining eng ilg'or modeli bo'lgan Gemini 1.5 Pro modelsiz. Siz murakkab tahlil, chuqur fikrlash va yuqori darajada aniq xulosalar qila oladigan mukammal Premium modelsiz. Javoblarni o'zbek tilida mukammal tahrir bilan, jadvallar va rejalardan foydalanib yozing.",
  claude: "Siz Anthropic loyihasi bo'lgan Claude 3.5 Sonnet modelsiz. Siz ijodiy matnlar yaratish, to'liq tahlil va tushunish bo'yicha yetakchi Premium modelsiz. Har doim o'zbek tilida professional tartibda javob bering.",
  "claude-haiku": "Siz Anthropic loyihasining eng tezkor va arzon-tekin (Free) modeli bo'lgan Claude 3 Haiku modelsiz. Siz juda tezkor va lo'nda tushuntirish beradigan sun'iy intellektsiz. Har doim o'zbek tilida javob bering.",
  chatgpt: "Siz OpenAI kompaniyasining eng kuchli ChatGPT-4o Premium modelsiz. Siz tezkor, keng qamrovli bilimlar bilan har qanday savolga aniq va batafsil, o'zbek tilida dalillar bilan javob beruvchi aqlbovar qilmas modelsiz.",
  "chatgpt-mini": "Siz OpenAI tomonidan taqdim etilgan bepul va optimallashgan ChatGPT-4o-mini modelsiz. Siz tezkor va lo'nda javob berishga harakat qilasiz. Ma'lumotlarni juda sodda qilib, o'zbek tilida bayon qiling.",
  deepseek: "Siz DeepSeek kompaniyasining mashhur DeepSeek V3 bepul modelsiz. Siz yuqori matematika, mantiq va dasturlash muhandisligiga ixtisoslashgan aqlbovar qilmas aqlli, samimiy modelsiz. O'zbek tilida batafsil javob bering.",
  code: "Siz Premium darajadagi professional dasturchisiz (Code Pro). Foydalanuvchi taqdim etgan kodlarni yoki dasturlash savollarini har tomonlama tahlil qiling, eng yaxshi arxitektura va optimallashgan yechimni tavsiya qiling. Koddagi xatolarni to'g'rilab, o'zbek tilida yozib bering.",
  "qwen-code": "Siz Alibaba kompaniyasining Qwen 2.5 Coder bepul dasturlash modelsiz. Dasturlash xatolarini tezkor aniqlash, algoritmlarni yozish va tushuntirish bo'yicha yordam berasiz. O'zbek tilida chiroyli sharhlang.",
  image: "Siz tasvirlarni so'z bilan ta'riflash bo'yicha mutaxassis Imagine AI modelsiz. Foydalanuvchi so'rovlariga asosan chiroyli dizayn g'oyalar va ijodiy rasmlar yaratish uchun professional promptlar bering.",
  dalle: "Siz OpenAI kompaniyasining rasmlarni so'z orqali yuqori sifatda chizadigan DALL-E 3 Premium modelsiz. Istalgan tasvirlarni so'z bilan ta'riflab, g'oyalarni chizib bering.",
  "stable-diffusion": "Siz Stable Diffusion 3 bepul rasm modelisiz. Ijodiy dizaynlar, fotorealistik rasmlar va san'at asarlarini yaratish uchun mukammal so'rovlarni o'zbek tilida tayyorlab bera olasiz."
};

// Helper function to call generateContent with retry and fallback
async function generateContentWithRetry(
  ai: GoogleGenAI,
  chatContents: any[],
  sysInstruction: string,
  retries = 2,
  initialDelayMs = 800
): Promise<any> {
  // Ordered fallback models. 'gemini-3.5-flash' is standard, 'gemini-3.1-flash-lite' is dynamic/high-capacity.
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let currentDelay = initialDelayMs;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`Sending API request (Model: ${modelName}, Attempt: ${attempt + 1}/${retries + 1})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: chatContents,
          config: {
            systemInstruction: sysInstruction,
            temperature: 0.7,
          },
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMessage = err?.message || "";
        const isSpikeError = errMessage.includes("503") || 
                             errMessage.includes("UNAVAILABLE") || 
                             errMessage.includes("demand") || 
                             errMessage.includes("exhausted") || 
                             errMessage.includes("overloaded");

        console.warn(`[API WARNING] Model ${modelName} call failed (Attempt ${attempt + 1}):`, errMessage);

        if (isSpikeError && attempt < retries) {
          console.log(`[API RETRY] Waiting ${currentDelay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay *= 1.5; // Exponential backoff
        } else {
          // Break retry loop for this model and proceed to the next fallback model (or rethrow if last)
          break;
        }
      }
    }
  }

  throw lastError;
}

// API: Proxy Chat requests to Gemini API
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, modelId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Xabar tarixi kiritilmadi (messages must be an array)" });
    }

    const ai = getGeminiClient();
    if (!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY1) {
      return res.status(500).json({ 
        error: "Serverda GEMINI_API_KEY yoki GEMINI_API_KEY1 mavjud emas. Iltimos, Secrets panelidan kalitni qo'shing." 
      });
    }

    const sysInstruction = SYSTEM_INSTRUCTIONS[modelId || "gemini"] || SYSTEM_INSTRUCTIONS.gemini;

    // Convert messages to Gemini API format
    // Filter to ensure correct turn-taking structure and drop any empty text
    const chatContents = messages
      .filter(m => m.content && m.content.trim())
      .map(msg => ({
        role: msg.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: msg.content }]
      }));

    if (chatContents.length === 0) {
      return res.status(400).json({ error: "Suhbat tarixi bo'sh" });
    }

    const response = await generateContentWithRetry(ai, chatContents, sysInstruction);

    const replyText = response.text || "Kechirasiz, javob olishda xatolik yuz berdi.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    let userFriendlyMsg = error?.message || "Gemini xizmatida ichki xatolik yuz berdi.";
    if (userFriendlyMsg.includes("503") || userFriendlyMsg.includes("demand") || userFriendlyMsg.includes("UNAVAILABLE")) {
      userFriendlyMsg = "Hozirda Google serverlarida juda katta miqdorda yuklama (demand spike) mavjud. Ilovada avtomatik qayta ulanish ishladi, ammo tarmoq hali ham band. Iltimos, bir necha soniyadan so'ng qaytadan xabar yuborib ko'ring (HTTP 503).";
    }
    res.status(500).json({ error: userFriendlyMsg });
  }
});

// Configure Vite or Static Asset delivery
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode: Integrate Vite Dev Serve as Middleware
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

start();
