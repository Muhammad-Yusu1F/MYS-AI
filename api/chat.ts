import { GoogleGenAI } from "@google/genai";

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
  "stable-diffusion": "Siz Stable Diffusion 3 bepul rasm modelisiz. Ijodiy dizaynlar, fotorealistik rasmlar va san'at asarlarini yaratish uchun mukammal so'rovlarni o'zbek tilida tayyorlab bera orasiz."
};

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, modelId } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Xabar tarixi kiritilmadi (messages must be an array)" });
    }

    const key = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY1;
    if (!key) {
      return res.status(500).json({ 
        error: "Serverda GEMINI_API_KEY yoki GEMINI_API_KEY1 kiritilmagan. Iltimos, Vercel Dashboard orqali Environment Variables bo'limiga qo'shing." 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const sysInstruction = SYSTEM_INSTRUCTIONS[modelId || "gemini"] || SYSTEM_INSTRUCTIONS.gemini;

    const chatContents = messages
      .filter(m => m.content && m.content.trim())
      .map(msg => ({
        role: msg.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: msg.content }]
      }));

    if (chatContents.length === 0) {
      return res.status(400).json({ error: "Suhbat tarixi bo'sh" });
    }

    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let lastError: any = null;
    let geminiResponse: any = null;

    for (const modelName of modelsToTry) {
      try {
        geminiResponse = await ai.models.generateContent({
          model: modelName,
          contents: chatContents,
          config: {
            systemInstruction: sysInstruction,
            temperature: 0.7,
          },
        });
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Fallback attempt for ${modelName} in Vercel function failed:`, err?.message || err);
      }
    }

    if (!geminiResponse) {
      throw lastError || new Error("Gemini API call failed with all fallbacks");
    }

    const replyText = geminiResponse.text || "Kechirasiz, javob olishda xatolik yuz berdi.";
    return res.status(200).json({ reply: replyText });
  } catch (error: any) {
    console.error("Vercel Serverless Function Error:", error);
    return res.status(500).json({ error: error?.message || "Ichki kognitiv tizim xatoligi" });
  }
}
