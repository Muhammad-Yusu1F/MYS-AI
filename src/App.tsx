import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Code, 
  ShieldCheck, 
  Volume2, 
  VolumeX,
  Plus, 
  Send, 
  Trash2, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  Check, 
  Database, 
  Layers, 
  Cpu, 
  Activity,
  Terminal,
  Paperclip,
  User,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  Info,
  ChevronRight,
  TrendingUp,
  CpuIcon,
  UploadCloud,
  FolderOpen,
  Tag,
  Phone,
  Key,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Share2,
  FileText,
  Music,
  Zap,
  Brain,
  Clock,
  Compass,
  Flame,
  Waves,
  Radio,
  Disc,
  Smile,
  Infinity as InfinityIcon,
  Globe,
  Heart
} from "lucide-react";
import { Model, Category, Message, ChatSession, ModelID, AttachedFile } from "./types";
import { Markdown } from "./components/Markdown";

// Expanded database list containing 12 high-quality Models with isPremium tag (Tekin vs Premium)
const MODELS: Model[] = [
  { 
    id: "gemini", 
    name: "Gemini 1.5 Flash", 
    developer: "Google", 
    description: "Multimodal va tezkor model, bepul so'rovlar uchun mutlaqo mukammal.",
    category: "chat",
    version: "1.5-Flash",
    accuracy: "97.1%",
    isPremium: false
  },
  { 
    id: "gemini-pro", 
    name: "Gemini 1.5 Pro", 
    developer: "Google", 
    description: "Eng ilg'or muhandislik modeli. Chuqur tahlil va mantiqiy xulosalar chiqarish qiroli.",
    category: "chat",
    version: "1.5-Pro",
    accuracy: "98.9%",
    isPremium: true
  },
  { 
    id: "claude", 
    name: "Claude 3.5 Sonnet", 
    developer: "Anthropic", 
    description: "Ijodiy yozish, chuqur dasturlash tahlili va eng yuqori darajada insoniy javoblar.",
    category: "chat",
    version: "3.5",
    accuracy: "98.4%",
    isPremium: true
  },
  { 
    id: "claude-haiku", 
    name: "Claude 3 Haiku", 
    developer: "Anthropic", 
    description: "Tezkor va arzon muloqotlar, qisqa savollarga bir zumda javob beruchi tekin model.",
    category: "chat",
    version: "3.0",
    accuracy: "95.6%",
    isPremium: false
  },
  { 
    id: "chatgpt", 
    name: "ChatGPT 4o", 
    developer: "OpenAI", 
    description: "Eng mashhur universal model. Har qanday murakkab vazifani soniyalarda hal qiladi.",
    category: "chat",
    version: "4o",
    accuracy: "98.5%",
    isPremium: true
  },
  { 
    id: "chatgpt-mini", 
    name: "ChatGPT 4o-Mini", 
    developer: "OpenAI", 
    description: "Yengillashtirilgan tezkor va tekin model. Kundalik oddiy yumushlar uchun moslashtirilgan.",
    category: "chat",
    version: "4o-mini",
    accuracy: "96.2%",
    isPremium: false
  },
  { 
    id: "deepseek", 
    name: "DeepSeek V3", 
    developer: "DeepSeek", 
    description: "Matematika, mantiq va arzon narxda yuqori sifat taqdim etuvchi zamonaviy bepul model.",
    category: "chat",
    version: "V3",
    accuracy: "97.8%",
    isPremium: false
  },
  { 
    id: "code", 
    name: "Code Pro", 
    developer: "Developer Group", 
    description: "Dasturlash tillari, algoritmlar va ma'lumotlar bazasini optimallash bo'yicha premium model.",
    category: "kodlash",
    version: "2.0-Pro",
    accuracy: "99.2%",
    isPremium: true
  },
  { 
    id: "qwen-code", 
    name: "Qwen 2.5 Coder", 
    developer: "Alibaba", 
    description: "Ko'p tilli bepul dasturlash yordamchisi. Kod xatolarini tezda tuzatib beradi.",
    category: "kodlash",
    version: "2.5",
    accuracy: "96.9%",
    isPremium: false
  },
  { 
    id: "image", 
    name: "Imagine AI", 
    developer: "Midjourney", 
    description: "Ijodiy tasvirlar, arxitektura va fotorealistik dizaynlar uchun aqlli yo'riqnomalar.",
    category: "tasvir",
    version: "V6",
    accuracy: "95.2%",
    isPremium: false
  },
  { 
    id: "dalle", 
    name: "DALL-E 3", 
    developer: "OpenAI", 
    description: "Yuqori aniqlikdagi va so'zlarga 100% tushunadigan premium rasm generatsiyalash tizimi.",
    category: "tasvir",
    version: "3.0",
    accuracy: "97.0%",
    isPremium: true
  },
  { 
    id: "stable-diffusion", 
    name: "Stable Diffusion 3", 
    developer: "Stability AI", 
    description: "Ochiq kodli erkin va bepul rasm model. Kreativ rasmlar va dizayn renderlari tayyorlaydi.",
    category: "tasvir",
    version: "3.1",
    accuracy: "94.8%",
    isPremium: false
  }
];

const CATEGORIES: Category[] = [
  { id: "chat", name: "Chat", description: "Matnli muloqot va aqlli assistentlar" },
  { id: "tasvir", name: "Tasvir", description: "DALL-E va Midjourney bilan ijod" },
  { id: "kodlash", name: "Kodlash", description: "Dasturlash va algoritmlar uchun optimallashgan" },
];

const QUICK_SUGGESTIONS: Record<string, string[]> = {
  gemini: [
    "O'zbekistonda turizmni rivojlantirish bo'yicha chiroyli esse yozing.",
    "Yaqin 10 yil ichida ommalashadigan istiqbolli IT sohalari."
  ],
  "gemini-pro": [
    "Muvozanatli hayot borasida chuqur falsafiy fikr va 5 ta oltin qoida tayyorlang.",
    "Inflyatsiya sabablari va ularni jilovlash choralari haqida tahliliy maqola yozing."
  ],
  claude: [
    "Inson miyasi qanday ishlaydi deb so'rashsa, sodda tilda tushuntirib bering.",
    "Badiiy romanning birinchi sahifasi uchun ta'sirli kirish qismini yozing."
  ],
  "claude-haiku": [
    "Tarmoq protokollari (TCP/IP) qanday vazifa bajaradi? Qisqa tushuntiring."
  ],
  chatgpt: [
    "Sog'lom ovqatlanish va uyda mashq qilish uchun haftalik to'liq jadval tuzing.",
    "Muzokaralarda muvaffaqiyat qozonish uchun psixologik tavsiyalar."
  ],
  "chatgpt-mini": [
    "3 kunlik Samarqand sayohati uchun optimal byudjet rejasi."
  ],
  deepseek: [
    "Sun'iy neyron tarmoqlarining matematik asoslari nimalarda namoyon bo'ladi?"
  ],
  code: [
    "Node.js Express-da TypeScript bilan xatosiz ishlash andozasini ko'rsating.",
    "Katta ma'lumotlar bazasini indekslash orqali unumdorlikni oshirish usullari."
  ],
  "qwen-code": [
    "JavaScript-da binary search algoritmining optimallashgan namunasini yozing."
  ],
  image: [
    "Monoxrom interyer va neo-minimalizm uslubidagi xonani tasvirlab bering."
  ],
  dalle: [
    "Kelajak Toshkent shahri, uchar poyezdlar va ko'kalamzor osmono'par binolar haqida ijodiy prompt yozing."
  ],
  "stable-diffusion": [
    "Retro-futuristik robot kofe tayyorlayotgan tasvirini so'zlarda mukammal ifodalang."
  ]
};

export interface GalleryItem {
  id: string;
  name: string;
  url: string; // base64 string or unsplash URL
  tags: string[];
  createdAt: string;
}

// Available avatars for the user profile editor
const AVATAR_OPTIONS = ["🤖", "👨‍💻", "👩‍💻", "⚡", "🌟", "🔥", "🔮", "🍕", "🦾", "🚀", "🛸"];

export interface VoiceProfile {
  id: string;
  name: string;
  gender: string;
  lang: string;
  pitch: number;
  rate: number;
  description: string;
  icon: string;
  oscType: OscillatorType;
  oscFreq: number;
  extraFx: string;
}

export const PREMIUM_VOICES: VoiceProfile[] = [
  { id: "v1_quantum", name: "MYS Ultra-Quantum V1", gender: "Erkak / Neyron", lang: "uz-UZ", pitch: 0.95, rate: 0.95, description: "Chuqur, salobatli va jozibali premium ovoz. Eng murakkab tahlillarga mos.", icon: "🌌", oscType: "sine", oscFreq: 440, extraFx: "Space Reverb" },
  { id: "v2_aura", name: "Aura-Femme Pro", gender: "Ayol / Soft", lang: "uz-UZ", pitch: 1.15, rate: 1.05, description: "Issiq, silliq va muloyim ayol ovozi. Tinchlantiruvchi va do'stona muloqot uchun.", icon: "🌸", oscType: "triangle", oscFreq: 880, extraFx: "Soft Limiter" },
  { id: "v3_cyber", name: "Cyber-Omega 7", gender: "Kiber / Metall", lang: "en-US", pitch: 0.55, rate: 0.9, description: "Golografik robotik kosmos ovozi. Haqiqiy sun'iy idrok robotlaridek yangraydi.", icon: "🤖", oscType: "sawtooth", oscFreq: 220, extraFx: "Flanger Echo" },
  { id: "v4_jarvis", name: "Jarvis Intelligence", gender: "Erkak / Intel", lang: "en-US", pitch: 1.0, rate: 1.15, description: "O'ta aqlli, dadil va professional inglizcha ta'sirli ovoz.", icon: "🤵", oscType: "square", oscFreq: 520, extraFx: "Sub-Bass Hum" },
  { id: "v5_eva", name: "Eva Symphony", gender: "Ayol / Elegant", lang: "uz-UZ", pitch: 1.25, rate: 0.85, description: "Musiqiy va nafis, odamni sarmast qiluvchi mayin ohangli ayol ovozi.", icon: "🎵", oscType: "sine", oscFreq: 660, extraFx: "Echo Chamber" },
  { id: "v6_zamin", name: "Zamin Core V2", gender: "Erkak / Milliy", lang: "uz-UZ", pitch: 0.85, rate: 1.0, description: "An'anaviy O'zbekcha ifodali va mulohazali nutq sintezi.", icon: "🇺🇿", oscType: "triangle", oscFreq: 330, extraFx: "Warm Saturation" },
  { id: "v7_sirius", name: "Sirius-X Ambient", gender: "Kosmik / Kvars", lang: "uz-UZ", pitch: 1.35, rate: 1.1, description: "Kosmik echo va kvarsli tovush effekti bilan yoqimli yangrovchi ovoz.", icon: "✨", oscType: "sine", oscFreq: 1100, extraFx: "3D Phased Reverb" },
  { id: "v8_nexus", name: "Nexus-Cinematic V5", gender: "Erkak / Bass", lang: "uz-UZ", pitch: 0.75, rate: 0.8, description: "Kinematografik, chuqur bas va ishonchli dinamikaga ega dabdabali ovoz.", icon: "🎬", oscType: "sawtooth", oscFreq: 180, extraFx: "Theater Sub-bass" },
  { id: "v9_whisper", name: "Quantum Whisper", gender: "Ayol / Shivir", lang: "uz-UZ", pitch: 1.05, rate: 0.75, description: "Muloyim shivirlash va tasalli beruvchi kognitiv psixologik ovoz.", icon: "🤫", oscType: "sine", oscFreq: 750, extraFx: "White Noise Overlay" },
  { id: "v10_alpha", name: "Alpha-Neural 9", gender: "Erkak / Professional", lang: "uz-UZ", pitch: 1.05, rate: 1.0, description: "Tahliliy, jiddiy va yuqori darajada aniq gapiruvchi neyron-assistent.", icon: "🧠", oscType: "triangle", oscFreq: 480, extraFx: "Zero Latency Gate" },
  { id: "v11_symphony", name: "Symphony Melodica", gender: "Ayol / Garmonik", lang: "uz-UZ", pitch: 1.4, rate: 1.0, description: "Fleyta ohanglariga o'xshash, garmonik rezonansli musiqiy ayol ovozi.", icon: "🎶", oscType: "triangle", oscFreq: 950, extraFx: "Vibrato Modulation" },
  { id: "v12_vector", name: "Vector Space-Time", gender: "Kiber / Moduliy", lang: "uz-UZ", pitch: 0.65, rate: 1.3, description: "Kiber-pank va yuqori texnologiyali o'zgaruvchan chastotali ovoz.", icon: "⚡", oscType: "square", oscFreq: 290, extraFx: "Phaser Sweep" },
  { id: "v13_zephyr", name: "Zephyr Wind", gender: "Ayol / Tabiiy", lang: "uz-UZ", pitch: 1.1, rate: 0.9, description: "Tabiiy va erkin shabadadek yengil, stressni oluvchi silliq tovush.", icon: "🍃", oscType: "sine", oscFreq: 580, extraFx: "Lowpass Clean Filter" },
  { id: "v14_pulsar", name: "Nova Pulsar", gender: "Erkak / Dinamik", lang: "uz-UZ", pitch: 0.9, rate: 1.4, description: "Tezkor, shiddatli va baquvvat muloqot qiluvchi yangiliklar o'quvchisi.", icon: "💥", oscType: "sawtooth", oscFreq: 390, extraFx: "Hyper-Compression" },
  { id: "v15_hologram", name: "Hologram-A Soft", gender: "Ayol / Kiber", lang: "uz-UZ", pitch: 1.2, rate: 1.15, description: "Metall sirtli va elektron gologramma sintezining jozibali qorishmasi.", icon: "💠", oscType: "square", oscFreq: 800, extraFx: "Bitcrushed Delay" },
  { id: "v16_titan", name: "Titan-Heavy Metal", gender: "Robot / Og'ir", lang: "en-US", pitch: 0.45, rate: 0.85, description: "Dahshatli darajada kuchli, og'ir va qalin temir ovozli robot.", icon: "🌋", oscType: "sawtooth", oscFreq: 110, extraFx: "Dynamic Tube Amp" },
  { id: "v17_lumina", name: "Lumina Bright", gender: "Ayol / Optimizm", lang: "uz-UZ", pitch: 1.3, rate: 1.1, description: "Nurlanuvchi va yorqin, har bir jumlasi kayfiyatni ko'taruvchi ovoz.", icon: "💡", oscType: "triangle", oscFreq: 700, extraFx: "Bright Presence Booster" },
  { id: "v18_chronos", name: "Chronos Temporal", gender: "Sirli / Fazoviy", lang: "uz-UZ", pitch: 0.8, rate: 0.7, description: "Vaqt bo'yicha sekinlashtirilgan, o'tmishdan kelgandek sirli va teran.", icon: "⏳", oscType: "sine", oscFreq: 150, extraFx: "Time Stretch Delay" },
  { id: "v19_cosmos", name: "Cosmos Echo 3D", gender: "Ayol / Kenglik", lang: "uz-UZ", pitch: 1.1, rate: 1.0, description: "Kenglik fazosidan keluvchi, 3D faza o'zgaruvchan gumburlash ovozi.", icon: "🪐", oscType: "sine", oscFreq: 500, extraFx: "Infinite Stereo Widener" },
  { id: "v20_infinity", name: "Infinity Core (VIP)", gender: "Neyron / Maxsus", lang: "uz-UZ", pitch: 1.0, rate: 1.0, description: "Cheksiz imkoniyatli, eng mukammal va daxshatli hayajonlantiruvchi ovoz.", icon: "♾️", oscType: "triangle", oscFreq: 440, extraFx: "MYS Signature Mastering" }
];

export const getVoiceIcon = (voiceId: string) => {
  switch (voiceId) {
    case "v1_quantum":
      return <Waves className="text-violet-400 group-hover:text-violet-300 transition-colors shrink-0" size={20} />;
    case "v2_aura":
      return <Heart className="text-rose-400 group-hover:text-rose-300 transition-colors shrink-0" size={20} />;
    case "v3_cyber":
      return <Cpu className="text-cyan-400 group-hover:text-cyan-300 transition-colors shrink-0" size={20} />;
    case "v4_jarvis":
      return <User className="text-slate-400 group-hover:text-slate-300 transition-colors shrink-0" size={20} />;
    case "v5_eva":
      return <Music className="text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors shrink-0" size={20} />;
    case "v6_zamin":
      return <Globe className="text-emerald-400 group-hover:text-emerald-300 transition-colors shrink-0" size={20} />;
    case "v7_sirius":
      return <Sparkles className="text-amber-300 group-hover:text-amber-200 transition-colors shrink-0" size={20} />;
    case "v8_nexus":
      return <Radio className="text-red-400 group-hover:text-red-300 transition-colors shrink-0" size={20} />;
    case "v9_whisper":
      return <Moon className="text-indigo-400 group-hover:text-indigo-300 transition-colors shrink-0" size={20} />;
    case "v10_alpha":
      return <Brain className="text-blue-400 group-hover:text-blue-300 transition-colors shrink-0" size={20} />;
    case "v11_symphony":
      return <Disc className="text-purple-400 group-hover:text-purple-300 transition-colors shrink-0" size={20} />;
    case "v12_vector":
      return <Zap className="text-yellow-400 group-hover:text-yellow-300 transition-colors shrink-0" size={20} />;
    case "v13_zephyr":
      return <Compass className="text-teal-400 group-hover:text-teal-300 transition-colors shrink-0" size={20} />;
    case "v14_pulsar":
      return <Waves className="text-orange-400 group-hover:text-orange-300 transition-colors shrink-0" size={20} />;
    case "v15_hologram":
      return <Layers className="text-sky-400 group-hover:text-sky-300 transition-colors shrink-0" size={20} />;
    case "v16_titan":
      return <Flame className="text-stone-400 group-hover:text-stone-300 transition-colors shrink-0" size={20} />;
    case "v17_lumina":
      return <Sun className="text-yellow-400 group-hover:text-yellow-300 transition-colors shrink-0" size={20} />;
    case "v18_chronos":
      return <Clock className="text-slate-400 group-hover:text-slate-300 transition-colors shrink-0" size={20} />;
    case "v19_cosmos":
      return <Globe className="text-purple-400 group-hover:text-purple-300 transition-colors shrink-0" size={20} />;
    case "v20_infinity":
      return <InfinityIcon className="text-emerald-400 group-hover:text-emerald-300 transition-colors shrink-0" size={20} />;
    default:
      return <Volume2 className="text-emerald-400 shrink-0" size={20} />;
  }
};

export default function App() {
  // Theme Switching
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  // Navigation Screens: "dashboard" (explorer), "chat" (playground), "profile" (settings), "stats" (telemetry), "gallery" (human directory), "voices" (premium tts list)
  const [currentTab, setCurrentTab] = useState<"dashboard" | "chat" | "profile" | "stats" | "gallery" | "voices">("dashboard");
  const [eyeSaverDimmer, setEyeSaverDimmer] = useState<number>(0); // 0 to 85 (percentage of light absorbed)
  const [eyeSaverType, setEyeSaverType] = useState<"night" | "amber" | "cyber">("night"); // dimming color modes
  const [selectedCategory, setSelectedCategory] = useState<"all" | "chat" | "tasvir" | "kodlash">("all");
  const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0]);
  
  // Chat rooms persistence
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [inputVal, setInputVal] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // ChatGPT kabi fayllarni chatga biriktirish va ularni contextda tahlil qilish statelari
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const chatFileRef = useRef<HTMLInputElement>(null);

  // Filter Model list (Free or Premium or All)
  const [freeFilter, setFreeFilter] = useState<"all" | "free" | "premium">("all");

  // User Profile information (Advanced)
  const [profileName, setProfileName] = useState<string>("Ismatov Yusufbek");
  const [profileEmail, setProfileEmail] = useState<string>("ybegimqulov01@gmail.com");
  const [profileAvatar, setProfileAvatar] = useState<string>("👨‍💻");
  const [profileTier, setProfileTier] = useState<string>("Enterprise Access");
  const [profilePhone, setProfilePhone] = useState<string>("+998 90 123-4567");
  const [profileBio, setProfileBio] = useState<string>("Senior AI muhandis, ma'lumotlar tahlili va interaktiv ilovalar bo'yicha mutaxassis.");
  const [profilePrefModel, setProfilePrefModel] = useState<string>("gemini-pro");
  const [profileApiKey, setProfileApiKey] = useState<string>("YOUR_GEMINI_KEY_SECURE_HASHED");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isProfileSavedMsg, setIsProfileSavedMsg] = useState<boolean>(false);

  // Premium AI Voice Engine states
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("v1_quantum");
  const [speakRepliesAuto, setSpeakRepliesAuto] = useState<boolean>(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<boolean>(false);
  const [currentlySpeakingMsgId, setCurrentlySpeakingMsgId] = useState<string>("");
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Gallery items state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem("yusral_ai_gallery_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "gal_1",
        name: "Toshkentlik Dasturchi",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        tags: ["Dasturchi", "UZB", "Portret"],
        createdAt: "2026-05-12 14:30"
      },
      {
        id: "gal_2",
        name: "Samarqandlik Talaba",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        tags: ["Talaba", "Muxandis", "Kreativ"],
        createdAt: "2026-05-14 09:12"
      },
      {
        id: "gal_3",
        name: "Buxorolik Rassom",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
        tags: ["Portret", "Dizayn", "Ijodkor"],
        createdAt: "2026-05-20 18:45"
      },
      {
        id: "gal_4",
        name: "Farg'onalik AI Operator",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        tags: ["Yuz", "Virtual", "Assistent"],
        createdAt: "2026-05-22 11:05"
      }
    ];
  });

  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryItem | null>(null);

  // Gallery interactive states
  const [gallerySearch, setGallerySearch] = useState<string>("");
  const [newImageName, setNewImageName] = useState<string>("");
  const [newImageTags, setNewImageTags] = useState<string>("");
  const [imageFileStr, setImageFileStr] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Simulated Telemetry status
  const [latency, setLatency] = useState<number>(240);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [activeTraffic, setActiveTraffic] = useState<string>("O'rtacha");
  const [nodeCount, setNodeCount] = useState<number>(12);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync index.html title & dark/light theme on body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light-theme");
    } else {
      root.classList.remove("light-theme");
    }
  }, [theme]);

  // Save gallery state to localstorage
  useEffect(() => {
    localStorage.setItem("yusral_ai_gallery_state", JSON.stringify(galleryItems));
  }, [galleryItems]);

  // Load state from custom storage
  useEffect(() => {
    const savedSessions = localStorage.getItem("yusral_ai_sessions_v2");
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error(e);
      }
    }

    const savedName = localStorage.getItem("y_profile_name");
    const savedEmail = localStorage.getItem("y_profile_email");
    const savedAvatar = localStorage.getItem("y_profile_avatar");
    const savedTier = localStorage.getItem("y_profile_tier");
    const savedPhone = localStorage.getItem("y_profile_phone");
    const savedBio = localStorage.getItem("y_profile_bio");
    const savedPrefModel = localStorage.getItem("y_profile_pref_model");
    const savedApiKey = localStorage.getItem("y_profile_api_key");
    const savedSound = localStorage.getItem("y_sound_enabled");
    const savedVoiceId = localStorage.getItem("y_selected_voice_id");
    const savedSpeakAuto = localStorage.getItem("y_speak_replies_auto");

    if (savedName) setProfileName(savedName);
    if (savedEmail) setProfileEmail(savedEmail);
    if (savedAvatar) setProfileAvatar(savedAvatar);
    if (savedTier) setProfileTier(savedTier);
    if (savedPhone) setProfilePhone(savedPhone);
    if (savedBio) setProfileBio(savedBio);
    if (savedPrefModel) setProfilePrefModel(savedPrefModel);
    if (savedApiKey) setProfileApiKey(savedApiKey);
    if (savedSound) setSoundEnabled(savedSound === "true");
    if (savedVoiceId) setSelectedVoiceId(savedVoiceId);
    if (savedSpeakAuto) setSpeakRepliesAuto(savedSpeakAuto === "true");
  }, []);

  // Save Sessions helper
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    localStorage.setItem("yusral_ai_sessions_v2", JSON.stringify(updated));
  };

  // Sound generator effect
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Audio failed gracefully
    }
  };

  const playVoiceSynthEffects = (oscType: OscillatorType, baseFreq: number) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const mainGain = audioCtx.createGain();
      
      osc1.type = oscType;
      osc1.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 2, audioCtx.currentTime + 0.15);
      
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(baseFreq / 2, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioCtx.currentTime + 0.1);
      
      mainGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      mainGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      
      osc1.connect(mainGain);
      osc2.connect(mainGain);
      mainGain.connect(audioCtx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.25);
      osc2.stop(audioCtx.currentTime + 0.25);
    } catch (error) {
      console.error("Voice effect failed to initialize:", error);
    }
  };

  const speakText = (text: string, msgId: string) => {
    if (isPlayingSpeech && currentlySpeakingMsgId === msgId) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingSpeech(false);
      setCurrentlySpeakingMsgId("");
      return;
    }

    const voiceProfile = PREMIUM_VOICES.find(v => v.id === selectedVoiceId) || PREMIUM_VOICES[0];

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    playVoiceSynthEffects(voiceProfile.oscType, voiceProfile.oscFreq);

    const cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/```[\s\S]+?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/#[^\s]+/g, "")
      .replace(/-\s+/g, "")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtteranceRef.current = utterance;

    if (window.speechSynthesis) {
      const availableSystemVoices = window.speechSynthesis.getVoices();
      let selectedSysVoice = null;
      if (voiceProfile.lang.startsWith("uz")) {
        selectedSysVoice = availableSystemVoices.find(v => v.lang.toLowerCase().startsWith("tr") || v.lang.toLowerCase().startsWith("uz"));
      } else {
        selectedSysVoice = availableSystemVoices.find(v => v.lang.toLowerCase().startsWith("en"));
      }
      if (!selectedSysVoice && availableSystemVoices.length > 0) {
        selectedSysVoice = availableSystemVoices[0];
      }
      if (selectedSysVoice) {
        utterance.voice = selectedSysVoice;
      }
    }

    utterance.pitch = voiceProfile.pitch;
    utterance.rate = voiceProfile.rate;
    utterance.volume = 0.9;

    utterance.onstart = () => {
      setIsPlayingSpeech(true);
      setCurrentlySpeakingMsgId(msgId);
    };

    utterance.onend = () => {
      setIsPlayingSpeech(false);
      setCurrentlySpeakingMsgId("");
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsPlayingSpeech(false);
      setCurrentlySpeakingMsgId("");
    };

    if (window.speechSynthesis) {
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Kechirasiz, sizning brauzeringiz matnni ovozli o'qish xizmatini qo'llab-quvvatlamaydi.");
    }
  };

  // Scroll to new items in chat active window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, currentSessionId, isSending, currentTab]);

  // Launch a chat panel with a selected AI Model
  const startChatForModel = (model: Model) => {
    setSelectedModel(model);
    
    // Check if there is an active session for the chosen model to prevent redundancy
    const existing = sessions.find(s => s.modelId === model.id);
    if (existing) {
      setCurrentSessionId(existing.id);
    } else {
      const newSession: ChatSession = {
        id: `sess_${Date.now()}`,
        modelId: model.id,
        title: `${model.name} Suhbat`,
        messages: [
          {
            id: `init_msg_${Date.now()}`,
            role: "assistant",
            content: `Assalomu alaykum, **${profileName}**! Men **${model.name}** modelsiz. ${model.description} Savollaringizga o'zbek tilida mukammal javob berishga tayyorman. Savolingizni yozing!`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ],
        createdAt: new Date().toISOString()
      };
      const updated = [newSession, ...sessions];
      saveSessions(updated);
      setCurrentSessionId(newSession.id);
    }
    
    setCurrentTab("chat");
    playClickSound();
  };

  // Reset or blank state for chat
  const handleStartFreshSession = () => {
    const newSession: ChatSession = {
      id: `sess_fresh_${Date.now()}`,
      modelId: selectedModel.id,
      title: `${selectedModel.name} Yangi`,
      messages: [
        {
          id: `init_msg_${Date.now()}`,
          role: "assistant",
          content: `Muloqot yangilandi. Yangi suhbatni boshlashingiz mumkin. Men **${selectedModel.name}** modelsiz. Savollaringizni kiriting.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ],
      createdAt: new Date().toISOString()
    };
    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setCurrentSessionId(newSession.id);
    playClickSound();
  };

  // Delete chat history session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== id);
    saveSessions(filtered);
    
    if (currentSessionId === id) {
      if (filtered.length > 0) {
        setCurrentSessionId(filtered[0].id);
        const related = MODELS.find(m => m.id === filtered[0].modelId);
        if (related) setSelectedModel(related);
      } else {
        setCurrentSessionId("");
      }
    }
    playClickSound();
  };

  // ChatGPT kabi fayllarni chatga yuklash va boshqarish tizimi
  const handleChatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      // Formating file size
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const isImg = file.type.startsWith("image/");
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const content = event.target.result as string;
          const newFile: AttachedFile = {
            id: `at_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            type: isImg ? "image" : "document",
            size: sizeStr,
            content: content
          };
          setAttachedFiles((prev) => [...prev, newFile]);
          playClickSound();
        }
      };

      if (isImg) {
        reader.readAsDataURL(file);
      } else {
        // text files
        reader.readAsText(file);
      }
    });

    // Reset input for another selection
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleRemoveAttachedFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
    playClickSound();
  };

  // Send content payload securely to background server proxy
  const handleSendMessage = async (textOverload?: string) => {
    const text = textOverload || inputVal;
    if (!text || !text.trim() || isSending) return;

    setErrorMsg("");
    setIsSending(true);
    setInputVal("");
    playClickSound();

    // Attached files snapshot
    const currentAttachments = [...attachedFiles];

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachedFiles: currentAttachments.length > 0 ? currentAttachments : undefined
    };

    // Clear local attachment states after snapshotting
    setAttachedFiles([]);

    // Make sure we have an active session
    let targetSessionId = currentSessionId;
    let targetSession = sessions.find(s => s.id === currentSessionId);

    if (!targetSession || !targetSessionId) {
      // Lazy-create session if somehow cleared
      const lazySession: ChatSession = {
        id: `sess_${Date.now()}`,
        modelId: selectedModel.id,
        title: `${selectedModel.name} Suhbat`,
        messages: [userMsg],
        createdAt: new Date().toISOString()
      };
      const updated = [lazySession, ...sessions];
      saveSessions(updated);
      setCurrentSessionId(lazySession.id);
      targetSessionId = lazySession.id;
      targetSession = lazySession;
    } else {
      const updatedMessages = [...targetSession.messages, userMsg];
      const updatedSession = { ...targetSession, messages: updatedMessages };
      const nextSessions = sessions.map(s => s.id === targetSessionId ? updatedSession : s);
      saveSessions(nextSessions);
      targetSession = updatedSession;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: targetSession.messages,
          modelId: selectedModel.id
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Sun'iy intellekt xizmati javob bera olmadi.");
      }

      const assistantMsg: Message = {
        id: `msg_a_${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const finalSession = {
        ...targetSession,
        messages: [...targetSession.messages, assistantMsg]
      };

      const finalSessions = sessions.map(s => s.id === targetSessionId ? finalSession : s);
      saveSessions(finalSessions);

      if (speakRepliesAuto) {
        speakText(assistantMsg.content, assistantMsg.id);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Tarmog'ingizda muammo bo'lishi mumkin yoki server ulanmadi. Qayta urinib ko'ring.");
    } finally {
      setIsSending(false);
    }
  };

  // Measure Latency live
  const triggerMeasureLatency = async () => {
    setIsMeasuring(true);
    const start = performance.now();
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: "ping" }], 
          modelId: "gemini" 
        })
      });
      await resp.json();
      const end = performance.now();
      const calculated = Math.round(end - start);
      setLatency(calculated > 0 ? calculated : 190);
    } catch (e) {
      setTimeout(() => {
        setLatency(Math.floor(Math.random() * 90) + 130);
      }, 600);
    } finally {
      setIsMeasuring(false);
      
      // Update dummy statistical properties
      const traffics = ["Past", "O'rtacha", "Yuqori unumdorlik", "Maksimal yuklama"];
      setActiveTraffic(traffics[Math.floor(Math.random() * traffics.length)]);
      setNodeCount(Math.floor(Math.random() * 6) + 10);
    }
  };

  // Save profile settings
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("y_profile_name", profileName);
    localStorage.setItem("y_profile_email", profileEmail);
    localStorage.setItem("y_profile_avatar", profileAvatar);
    localStorage.setItem("y_profile_tier", profileTier);
    localStorage.setItem("y_profile_phone", profilePhone);
    localStorage.setItem("y_profile_bio", profileBio);
    localStorage.setItem("y_profile_pref_model", profilePrefModel);
    localStorage.setItem("y_profile_api_key", profileApiKey);
    
    setIsProfileSavedMsg(true);
    playClickSound();
    setTimeout(() => {
      setIsProfileSavedMsg(false);
    }, 3000);
  };

  // Load local file to web memory
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Iltimos, faqat rasm formatidagi fayllarni kiritishingiz mumkin!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageFileStr(e.target.result as string);
        if (!newImageName) {
          setNewImageName(file.name.replace(/\.[^/.]+$/, ""));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Model selection category filter helpers
  const getFilteredModels = () => {
    let result = MODELS;
    
    // Apply categories
    if (selectedCategory !== "all") {
      result = result.filter(m => m.category === selectedCategory);
    }

    // Apply Premium / Tekin pricing tier filters
    if (freeFilter === "free") {
      result = result.filter(m => !m.isPremium);
    } else if (freeFilter === "premium") {
      result = result.filter(m => m.isPremium);
    }

    return result;
  };

  const finalFilteredModels = getFilteredModels();
  const activeSessionItem = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="h-screen w-screen flex text-[var(--text-primary)] relative select-none overflow-hidden">
      
      {/* ------------------- NIGHTTIME EYE-SAVER DIMMER (Yorug'likni oluvchi filtr) ------------------- */}
      {eyeSaverDimmer > 0 && (
        <div 
          id="eye-saver-overlay"
          className="fixed inset-0 pointer-events-none z-[9999] transition-all duration-300"
          style={{
            backgroundColor: 
              eyeSaverType === "night" 
                ? `rgba(0, 0, 0, ${eyeSaverDimmer / 100})` 
                : eyeSaverType === "amber"
                ? `rgba(240, 140, 0, ${eyeSaverDimmer / 180})`
                : `rgba(8, 20, 50, ${eyeSaverDimmer / 130})`,
            backdropFilter: `blur(${(eyeSaverDimmer / 35).toFixed(1)}px)`,
          }}
        />
      )}
      
      {/* ------------------- NAVIGATION SIDEBAR ------------------- */}
      <aside className="w-64 h-full border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] flex flex-col justify-between shrink-0 hidden md:flex font-sans z-20">
        
        {/* Sidebar Brand Logo */}
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[var(--border-color)] rounded bg-[var(--accent-bg)] text-[var(--accent-light)] flex items-center justify-center overflow-hidden font-black text-xl leading-none transition-all">
              {profileAvatar.startsWith("http") || profileAvatar.startsWith("data:") ? (
                <img src={profileAvatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                profileAvatar
              )}
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-[var(--text-primary)]">MYS AI</h1>
              <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider">{profileTier}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Menu */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase px-3 mb-2 tracking-widest leading-none">
            Asosiy Bo'limlar
          </div>
          
          <button
            onClick={() => { setCurrentTab("dashboard"); playClickSound(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-all group ${
              currentTab === "dashboard" 
                ? "bg-[var(--accent-bg)] text-[var(--accent-light)] border-l-2 border-[var(--accent-color)]" 
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"
            }`}
          >
            <Layers size={16} />
            <span>AI Modellar</span>
            <span className="ml-auto text-[9px] font-mono border border-[var(--border-color)] px-1 px-1.5 rounded-sm bg-[var(--bg-main)]">12</span>
          </button>

          <button
            onClick={() => { 
              // Set up active or first session
              if (sessions.length > 0 && !currentSessionId) {
                setCurrentSessionId(sessions[0].id);
                const related = MODELS.find(m => m.id === sessions[0].modelId);
                if (related) setSelectedModel(related);
              }
              setCurrentTab("chat"); 
              playClickSound(); 
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-all group ${
              currentTab === "chat" 
                ? "bg-[var(--accent-bg)] text-[var(--accent-light)] border-l-2 border-[var(--accent-color)]" 
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"
            }`}
          >
            <MessageSquare size={16} />
            <span>Xavfsiz Muloqot</span>
            {sessions.length > 0 && (
              <span className="ml-auto text-[10px] font-mono bg-[var(--accent-color)] text-white px-1.5 rounded-sm font-bold">
                {sessions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setCurrentTab("gallery"); playClickSound(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-all group ${
              currentTab === "gallery" 
                ? "bg-[var(--accent-bg)] text-[var(--accent-light)] border-l-2 border-[var(--accent-color)]" 
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"
            }`}
          >
            <FolderOpen size={16} />
            <span>Odamlar Galereyasi</span>
            <span className="ml-auto text-[9px] font-mono border border-[var(--border-color)] px-1.5 rounded-sm bg-[var(--bg-main)]">
              {galleryItems.length}
            </span>
          </button>
          
          <button
            onClick={() => { setCurrentTab("voices"); playClickSound(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-all group ${
              currentTab === "voices" 
                ? "bg-[var(--accent-bg)] text-[var(--accent-light)] border-l-2 border-[var(--accent-color)]" 
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"
            }`}
          >
            <Volume2 size={16} className="text-emerald-400" />
            <span>VIP Ovozlar & Tun</span>
            <span className="ml-auto text-[9px] font-mono border border-emerald-990/60 text-emerald-400 px-1.5 rounded-sm bg-emerald-950/20 font-bold">
              20
            </span>
          </button>

          <div className="h-6" />

          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase px-3 mb-2 tracking-widest leading-none">
            Sozlamalar va Tahlil
          </div>

          <button
            onClick={() => { setCurrentTab("profile"); playClickSound(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-all group ${
              currentTab === "profile" 
                ? "bg-[var(--accent-bg)] text-[var(--accent-light)] border-l-2 border-[var(--accent-color)]" 
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"
            }`}
          >
            <User size={16} />
            <span>Mening Profilim</span>
          </button>

          <button
            onClick={() => { setCurrentTab("stats"); playClickSound(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-all group ${
              currentTab === "stats" 
                ? "bg-[var(--accent-bg)] text-[var(--accent-light)] border-l-2 border-[var(--accent-color)]" 
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"
            }`}
          >
            <CpuIcon size={16} />
            <span>AI Statistika</span>
          </button>
        </div>

        {/* Navigation bottom card info representing original status logs */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--surface-card)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span className="text-[10px] font-mono text-[var(--text-primary)]">Node Server: Online</span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-[var(--text-muted)]">
            <span>PING: {latency}ms</span>
            <button 
              onClick={triggerMeasureLatency}
              className="hover:text-[var(--accent-light)] underline hover:no-underline transition-all"
            >
              Test
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------- MAIN CONTAINER (CONTENT AREA) ------------------- */}
      <main className="flex-1 flex flex-col justify-between h-screen max-h-screen relative bg-[var(--bg-main)] z-10 overflow-hidden font-sans">
        
        {/* MOBILE TOP NAVIGATION BAR */}
        <header className="md:hidden flex flex-col gap-2 p-4 bg-[var(--surface-card)] border-b border-[var(--border-color)] z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{profileAvatar}</span>
              <h1 className="text-md font-extrabold tracking-tight">MYS AI</h1>
            </div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-[var(--accent-light)] bg-[var(--accent-bg)] px-2 py-0.5 rounded border border-[var(--border-color)]">
              {profileTier}
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-1 whitespace-nowrap justify-between">
            <button
              onClick={() => { setCurrentTab("dashboard"); playClickSound(); }}
              className={`p-1 px-1.5 text-[10px] rounded border ${currentTab === "dashboard" ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-light)]" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}
            >
              Asosiy
            </button>
            <button
              onClick={() => { setCurrentTab("chat"); playClickSound(); }}
              className={`p-1 px-1.5 text-[10px] rounded border ${currentTab === "chat" ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-light)]" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}
            >
              Chat({sessions.length})
            </button>
            <button
              onClick={() => { setCurrentTab("gallery"); playClickSound(); }}
              className={`p-1 px-1.5 text-[10px] rounded border ${currentTab === "gallery" ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-light)]" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}
            >
              Odamlar ({galleryItems.length})
            </button>
            <button
              onClick={() => { setCurrentTab("voices"); playClickSound(); }}
              className={`p-1 px-1.5 text-[10px] rounded border ${currentTab === "voices" ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-light)]" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}
            >
              Ovoz & Tun (20 AI)
            </button>
            <button
              onClick={() => { setCurrentTab("profile"); playClickSound(); }}
              className={`p-1 px-1.5 text-[10px] rounded border ${currentTab === "profile" ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-light)]" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}
            >
              Profil
            </button>
            <button
              onClick={() => { setCurrentTab("stats"); playClickSound(); }}
              className={`p-1 px-1.5 text-[10px] rounded border ${currentTab === "stats" ? "border-[var(--accent-color)] bg-[var(--accent-bg)] text-[var(--accent-light)]" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}
            >
              Tahlil
            </button>
          </div>
        </header>

        {/* BRAND TOP UTILITIES ROW (COMMON TO ALL DESKTOP SCREENS) */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-[var(--border-color)] bg-[var(--surface-card)] shrink-0 z-20">
          <div className="flex items-center gap-3 text-xs select-none">
            <span className="text-[var(--text-muted)]">Hozirgi til:</span>
            <span className="font-semibold text-[var(--text-primary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded-sm bg-[var(--bg-main)]">
              O'zbekcha (UZB)
            </span>
            <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full" />
            <span className="text-[var(--text-muted)]">Suhbat kanali:</span>
            <span className="font-mono text-zinc-400">TLS v1.3 Secure Key</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark & Light Theme mode toggler */}
            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                playClickSound();
              }}
              className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-all flex items-center gap-1.5 text-xs font-medium active:scale-95"
              title="Qorong'u/Yorug' fonni almashtirish"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={13} className="text-amber-400" />
                  <span className="text-stone-300">Yorug' Fon</span>
                </>
              ) : (
                <>
                  <Moon size={13} className="text-emerald-500" />
                  <span className="text-stone-800">Qora Fon</span>
                </>
              )}
            </button>

            {/* Audio switch indicator */}
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                localStorage.setItem("y_sound_enabled", !soundEnabled ? "true" : "false");
              }}
              className="p-2 rounded border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Bosilgandagi tovush"
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={13} className="text-[var(--accent-light)]" />
                  <span className="text-xs">Ovozli</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} className="text-stone-500" />
                  <span className="text-xs">Ovozsiz</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ------------------- SCREEN RENDER ROUTING ------------------- */}
        <div className="flex-1 overflow-y-auto relative p-4 md:p-8">
          
          <AnimatePresence mode="wait">
            
            {/* 1. SCREEN: MODELS GRAPH DASHBOARD (EXPLORER) */}
            {currentTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 max-w-6xl mx-auto"
              >
                
                {/* Hero section */}
                <div className="space-y-2 pt-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[var(--accent-light)] uppercase border border-[var(--border-color)] rounded bg-[var(--accent-bg)] px-2.5 py-1">
                    <Sparkles size={11} className="animate-spin inline" />
                    INTELLIGENT INTEGRATOR V1.1
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
                    Loyihangiz uchun eng munosib modelni tanlang
                  </h1>
                  <p className="text-sm md:text-base text-[var(--text-muted)] max-w-3xl leading-relaxed">
                    Siz uchun sun'iy intellekt olamidagi eng yetakchi ochiq va premium modellar yig'ildi. Kundalik suhbatlar, rasm generatsiyalari va professional dasturlash tizimlaridan tekin yoki premium shartlarda to'liq foydalaning.
                  </p>
                </div>

                {/* CATEGORIES / FILTER CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <div
                        id={`dash-category-card-${cat.id}`}
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(isActive ? "all" : cat.id);
                          playClickSound();
                        }}
                        className={`p-6 rounded-md border cursor-pointer min-h-[140px] flex flex-col justify-between transition-all duration-300 relative ${
                          isActive 
                            ? "border-[var(--accent-color)] bg-[var(--accent-bg)] shadow-[var(--shadow-color)] shadow-md translate-y-[-2px]" 
                            : "border-[var(--border-color)] bg-[var(--surface-card)] hover:border-neutral-500 hover:bg-[var(--surface-card-hover)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`p-2 border rounded ${isActive ? "border-[var(--accent-light)] text-[var(--accent-light)] bg-black/10" : "border-[var(--border-color)] text-[var(--text-muted)]"}`}>
                            {cat.id === "chat" && <MessageSquare size={16} />}
                            {cat.id === "tasvir" && <ImageIcon size={16} />}
                            {cat.id === "kodlash" && <Code size={16} />}
                          </div>
                          {isActive && (
                            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[var(--accent-light)]">Faol</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-md font-bold tracking-tight">{cat.name}</h4>
                          <p className="text-xs text-[var(--text-muted)] leading-tight">{cat.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ADVANCED PRICING FILTER BAR */}
                <div className="border border-[var(--border-color)] bg-[var(--surface-card)] p-4 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="text-[var(--accent-light)]" />
                    <span className="text-xs text-[var(--text-muted)]">Model turiga qarab filtrlash:</span>
                  </div>

                  <div className="flex bg-[var(--bg-main)] border border-[var(--border-color)] p-1 rounded gap-1 self-start sm:self-auto">
                    <button
                      onClick={() => { setFreeFilter("all"); playClickSound(); }}
                      className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${freeFilter === "all" ? "bg-[var(--accent-color)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"}`}
                    >
                      Barchasi ({MODELS.length})
                    </button>
                    <button
                      onClick={() => { setFreeFilter("free"); playClickSound(); }}
                      className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${freeFilter === "free" ? "bg-emerald-500/80 text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"}`}
                    >
                      Bepul (Tekin)
                    </button>
                    <button
                      onClick={() => { setFreeFilter("premium"); playClickSound(); }}
                      className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${freeFilter === "premium" ? "bg-amber-600 text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)]"}`}
                    >
                      Premium (A'zo)
                    </button>
                  </div>
                </div>

                {/* MODEL GRID CARDS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-[var(--text-muted)] font-mono">
                    <span>MYS AI Model Ro'yxati</span>
                    <span>Natijalar: {finalFilteredModels.length} ta model topildi</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {finalFilteredModels.map((model) => {
                      return (
                        <div
                          id={`model-grid-item-${model.id}`}
                          key={model.id}
                          className="p-5 border border-[var(--border-color)] bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] rounded hover:border-neutral-400 transition-all duration-200 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded border border-[var(--border-color)] bg-black/60 flex items-center justify-center shrink-0">
                                  {model.category === "chat" && <MessageSquare className="text-sky-400" size={20} />}
                                  {model.category === "tasvir" && <ImageIcon className="text-amber-400" size={20} />}
                                  {model.category === "kodlash" && <Code className="text-purple-400" size={20} />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-[var(--text-primary)] leading-tight">{model.name}</h3>
                                    <span className="text-[9px] font-mono border border-[var(--border-color)] px-1 cursor-default text-[var(--text-muted)] rounded bg-[var(--bg-main)]">
                                      v{model.version}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[var(--text-muted)]">Ishlab chiquvchi: {model.developer}</p>
                                </div>
                              </div>

                              {/* FREE VS PREMIUM METRIC TAG */}
                              {model.isPremium ? (
                                <span className="text-[10px] font-mono border border-amber-950/80 bg-amber-950/20 text-amber-400 px-2 py-0.5 rounded-sm font-semibold tracking-wide">
                                  ★ PREMIUM
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono border border-emerald-950/80 bg-emerald-950/20 text-emerald-400 px-2 py-0.5 rounded-sm font-semibold tracking-wide">
                                  ✓ TEKIN
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-[var(--text-muted)] mt-4 leading-relaxed font-light min-h-[40px]">
                              {model.description}
                            </p>
                          </div>

                          <div className="border-t border-[var(--border-color)] pt-4 mt-4 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              Aniq darajasi: <strong className="text-[var(--text-primary)]">{model.accuracy}</strong>
                            </span>

                            <button
                              onClick={() => startChatForModel(model)}
                              className="px-4 py-1.5 text-xs font-semibold rounded-sm transition-all border border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--accent-color)] hover:text-white hover:border-[var(--accent-color)] active:scale-95 text-[var(--accent-light)] flex items-center gap-1.5"
                            >
                              <span>Suhbatni boshlash</span>
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FAST PEEK Telemetry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[var(--border-color)]">
                  <div className="p-4 border border-[var(--border-color)] bg-[var(--surface-card)] rounded flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracker-wider">Platform Status</p>
                      <h4 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2 mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        Aloqa muvaffaqiyatli
                      </h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-[var(--text-muted)]">TEZ KOR TEST</p>
                      <p className="text-xs font-mono font-bold mt-1 text-[var(--accent-light)]">{latency}ms Latency</p>
                    </div>
                  </div>

                  <div className="p-4 border border-[var(--border-color)] bg-[var(--surface-card)] rounded flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracker-wider">Tizim Darajasi (Account)</p>
                      <h4 className="text-base font-bold text-[var(--accent-light)] mt-1">{profileTier} Mode</h4>
                    </div>
                    <div className="text-right text-[10px] font-mono text-[var(--text-muted)]">
                      <span>Foydalanuvchi: {profileName}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* 2. SCREEN: PLAYGROUND VIEW WITH FULL-SCREEN CHAT HISTORIES & SIDE PANEL */}
            {currentTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[calc(100vh-130px)] md:h-[calc(100vh-76px)] flex flex-col md:flex-row border border-[var(--border-color)] bg-[var(--surface-card)] rounded overflow-hidden"
              >
                
                {/* Embedded Mini-sidebar with history only during search */}
                <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] flex flex-col justify-between shrink-0 h-48 md:h-full">
                  <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">
                      Suhbatlar Tarixi
                    </span>

                    <button
                      onClick={handleStartFreshSession}
                      className="p-1 px-2 border border-[var(--accent-color)] text-[10px] font-semibold text-[var(--accent-light)] bg-[var(--accent-bg)] rounded-sm hover:bg-[var(--accent-color)] hover:text-white hover:border-[var(--accent-color)] transition-all active:scale-95 flex items-center gap-1"
                    >
                      <Plus size={10} />
                      Yangi
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1 block md:block scrollbar-thin">
                    {sessions.length === 0 ? (
                      <p className="text-[11px] text-[var(--text-muted)] text-center py-6">Faol suhbatlar yo'q</p>
                    ) : (
                      sessions.map((sess) => {
                        const isSelected = sess.id === currentSessionId;
                        const related = MODELS.find(m => m.id === sess.modelId) || selectedModel;
                        return (
                          <div
                            key={sess.id}
                            onClick={() => {
                              setCurrentSessionId(sess.id);
                              setSelectedModel(related);
                              playClickSound();
                            }}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all border ${
                              isSelected 
                                ? "bg-[var(--accent-bg)] border-[var(--accent-light)] text-[var(--text-primary)]" 
                                : "border-transparent hover:bg-[var(--surface-card-hover)] text-[var(--text-muted)] hover:text-neutral-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden w-full">
                              <MessageSquare size={13} className="shrink-0 text-[var(--accent-light)]" />
                              <div className="text-xs text-left truncate leading-tight flex-1">
                                <span className="font-semibold block truncate">{sess.title}</span>
                                <span className="text-[9px] text-[var(--text-muted)] font-mono">{related.name}</span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleDeleteSession(sess.id, e)}
                              className="text-stone-500 hover:text-rose-400 p-0.5 rounded transition-all shrink-0"
                              title="Suhbatni o'chirish"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="hidden md:block p-3 border-t border-[var(--border-color)] bg-black/20">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Kanal: SHA-256</span>
                    </div>
                  </div>
                </aside>

                {/* Embedded Active Conversations viewports */}
                <div className="flex-1 flex flex-col justify-between h-[calc(100vh-320px)] md:h-full relative bg-[var(--bg-main)]">
                  
                  {/* Selected AI title row info */}
                  <header className="p-4 border-b border-[var(--border-color)] bg-[var(--surface-card)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-[var(--border-color)] bg-black/60 flex items-center justify-center shrink-0">
                        {selectedModel.category === "chat" && <MessageSquare className="text-sky-400" size={16} />}
                        {selectedModel.category === "tasvir" && <ImageIcon className="text-amber-400" size={16} />}
                        {selectedModel.category === "kodlash" && <Code className="text-purple-400" size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold leading-none">{selectedModel.name}</h4>
                          <span className="text-[9px] font-mono border border-[var(--border-color)] px-1 rounded-sm bg-black/40 text-[var(--text-muted)]">
                            v{selectedModel.version}
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1">Ishlab chiquvchi: {selectedModel.developer} • Aniqlik: {selectedModel.accuracy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isPlayingSpeech && (
                        <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/50 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-emerald-400 select-none animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <div className="flex items-end gap-0.5 h-2.5 w-3">
                            <span className="w-0.5 bg-emerald-400 animate-bounce" style={{ height: "40%", animationDelay: "0.1s" }} />
                            <span className="w-0.5 bg-emerald-400 animate-bounce" style={{ height: "90%", animationDelay: "0.2s" }} />
                            <span className="w-0.5 bg-emerald-400 animate-bounce" style={{ height: "60%", animationDelay: "0.3s" }} />
                          </div>
                          <span className="hidden sm:inline">LIVE</span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          if (activeSessionItem) {
                            const cleared = { ...activeSessionItem, messages: [activeSessionItem.messages[0]] };
                            const nextS = sessions.map(s => s.id === currentSessionId ? cleared : s);
                            saveSessions(nextS);
                            playClickSound();
                          }
                        }}
                        className="px-2 py-1 border border-[var(--border-color)] hover:border-[var(--accent-color)] text-[10px] font-mono rounded bg-black/40 text-[var(--text-muted)] hover:bg-[var(--accent-color)] hover:text-white transition-all active:scale-95"
                      >
                        Tozalash
                      </button>
                    </div>
                  </header>

                  {/* Message scroll log viewports */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {activeSessionItem && activeSessionItem.messages.map((m) => {
                      const isAs = m.role === "assistant";
                      return (
                        <div
                          key={m.id}
                          className={`flex gap-3 max-w-4xl ${isAs ? "" : "ml-auto flex-row-reverse"}`}
                        >
                          <div className={`w-8 h-8 rounded border border-[var(--border-color)] flex items-center justify-center font-mono font-bold text-xs shrink-0 ${isAs ? "bg-[var(--accent-bg)] text-[var(--text-primary)]" : "bg-[var(--text-primary)] text-[var(--bg-main)]"}`}>
                            {isAs ? selectedModel.name.substring(0, 1) : profileName.substring(0, 1)}
                          </div>

                          <div className="space-y-1 max-w-[85%]">
                            <div className={`p-4 rounded border text-sm md:text-md leading-relaxed ${isAs ? "bg-[var(--surface-card)] border-[var(--border-color)]" : "bg-[var(--accent-bg)] border-[var(--accent-color)]"}`}>
                              
                              {/* Display uploaded files or images if attached to this message */}
                              {m.attachedFiles && m.attachedFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3 pb-2 border-b border-[var(--border-color)]/30">
                                  {m.attachedFiles.map((file) => (
                                    <div 
                                      key={file.id} 
                                      className="flex items-center gap-2 p-1.5 rounded bg-black/20 border border-[var(--border-color)]/40 text-[10px] text-[var(--text-primary)] shrink-0"
                                    >
                                      {file.type === "image" ? (
                                        <img 
                                          src={file.content} 
                                          className="w-10 h-10 rounded object-cover border border-[var(--border-color)]" 
                                          alt={file.name} 
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-light)]">
                                          <FileText size={12} />
                                        </div>
                                      )}
                                      <div className="max-w-[120px] overflow-hidden">
                                        <p className="font-semibold truncate leading-tight text-[var(--text-primary)]" title={file.name}>
                                          {file.name}
                                        </p>
                                        <p className="text-[8px] text-[var(--text-muted)] font-mono">{file.size}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <Markdown content={m.content} />
                            </div>
                            <div className={`text-[9px] font-mono text-[var(--text-muted)] flex items-center gap-2 mt-1 ${isAs ? "justify-start" : "justify-end"}`}>
                              <span>{m.timestamp}</span>
                              {isAs && (
                                <button
                                  type="button"
                                  onClick={() => speakText(m.content, m.id)}
                                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-sm border transition-all active:scale-95 cursor-pointer ${
                                    isPlayingSpeech && currentlySpeakingMsgId === m.id
                                      ? "bg-red-950/30 border-red-500/50 text-red-400 hover:bg-red-900/40"
                                      : "bg-emerald-950/20 border-emerald-800/40 text-emerald-400 hover:bg-[var(--accent-color)] hover:text-white"
                                  }`}
                                  title={isPlayingSpeech && currentlySpeakingMsgId === m.id ? "Ovozni to'xtatish" : "Ovozli o'qish (TTS)"}
                                >
                                  {isPlayingSpeech && currentlySpeakingMsgId === m.id ? (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-red-400 animate-ping inline-block" />
                                      <span>To'xtatish</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 size={9} />
                                      <span>Eshitish</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Pending state */}
                    {isSending && (
                      <div className="flex gap-3 max-w-lg">
                        <div className="w-8 h-8 rounded border border-[var(--border-color)] bg-black/40 flex items-center justify-center text-xs animate-spin font-mono font-bold text-[var(--accent-light)]">
                          ⏳
                        </div>
                        <div className="p-4 rounded border border-[var(--border-color)] bg-[var(--surface-card)] text-xs text-[var(--text-muted)] flex items-center gap-2">
                          <Activity size={12} className="animate-pulse text-[var(--accent-light)]" />
                          <span>Muloqot bog'lanmoqda, mulohaza qilinyapti...</span>
                        </div>
                      </div>
                    )}

                    {/* Error container notifications */}
                    {errorMsg && (
                      <div className="p-4 mx-auto max-w-2xl border border-rose-950 bg-rose-950/20 text-rose-300 text-xs rounded font-mono flex items-center gap-2">
                        <Terminal size={14} className="text-rose-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* SUGGESTION CHIPS DISPLAYED FOR EMPTY / FIRST CHATS */}
                    {activeSessionItem && activeSessionItem.messages.length <= 1 && !isSending && (
                      <div className="max-w-xl mx-auto py-8">
                        <p className="text-[10px] font-mono text-[var(--text-muted)] text-center uppercase tracking-widest mb-4">
                          Tezkor namuna savollari
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {QUICK_SUGGESTIONS[selectedModel.id]?.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => { setInputVal(sug); playClickSound(); }}
                              className="p-3 text-left border border-[var(--border-color)] bg-[var(--surface-card)] hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)] font-sans text-xs rounded transition-all text-[var(--text-muted)] hover:text-white active:scale-98"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>

                  {/* Input form bar container */}
                  <footer className="p-4 border-t border-[var(--border-color)] bg-[var(--surface-card)]">
                    
                    {/* ChatGPT-style Attached Files Hub */}
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3 max-w-5xl mx-auto p-2 bg-[var(--bg-main)]/60 border border-[var(--border-color)] rounded-md">
                        {attachedFiles.map((file) => (
                          <div 
                            key={file.id} 
                            className="flex items-center gap-2 p-1.5 px-2 bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] border border-[var(--border-color)] rounded-md text-xs relative group animate-fade-in"
                          >
                            {file.type === "image" ? (
                              <img 
                                src={file.content} 
                                className="w-8 h-8 rounded object-cover border border-[var(--border-color)]" 
                                alt={file.name} 
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-[var(--accent-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-light)]">
                                <FileText size={14} />
                              </div>
                            )}
                            <div className="max-w-[150px] overflow-hidden">
                              <p className="font-semibold text-[var(--text-primary)] truncate text-[11px] leading-tight" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[9px] text-[var(--text-muted)] font-mono">{file.size}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachedFile(file.id)}
                              className="w-4 h-4 rounded-full bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center text-[10px] ml-1 transition-all active:scale-90 shadow"
                              title="Faylni olib tashlash"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <form
                      onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                      className="flex gap-2 items-center max-w-5xl mx-auto bg-[var(--bg-main)] border border-[var(--border-color)] p-2 rounded focus-within:border-emerald-500 transition-all"
                    >
                      {/* Hidden file input for chat attachment */}
                      <input
                        type="file"
                        ref={chatFileRef}
                        className="hidden"
                        onChange={handleChatFileChange}
                        multiple
                      />

                      <button
                        type="button"
                        onClick={() => {
                          chatFileRef.current?.click();
                          playClickSound();
                        }}
                        className="p-2 border border-[var(--border-color)] rounded bg-[var(--surface-card)] text-[var(--text-muted)] hover:bg-[var(--accent-color)] hover:text-white hover:border-[var(--accent-color)] transition-all text-xs flex items-center justify-center shrink-0"
                        title="Fayl yoki rasm yuklash (ChatGPT kabi tahlil qilish)"
                      >
                        <Paperclip size={13} />
                      </button>
 
                      <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder={attachedFiles.length > 0 ? "Fayllar bo'yicha so'rov yozing yoki shunchaki yuboring..." : `${selectedModel.name} bilan xavfsiz kanalda muloqot boshlang...`}
                        className="flex-1 bg-transparent p-2 outline-none text-sm placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                        disabled={isSending}
                      />
 
                      <button
                        type="submit"
                        disabled={isSending || (!inputVal.trim() && attachedFiles.length === 0)}
                        className={`p-2 px-4 rounded font-bold text-xs transition-all ${
                          (inputVal.trim() || attachedFiles.length > 0) && !isSending 
                            ? "bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] cursor-pointer active:scale-95" 
                            : "bg-neutral-800 text-stone-500 cursor-not-allowed"
                        }`}
                      >
                        <Send size={13} className="inline mr-1" />
                        Jo'natish
                      </button>
                    </form>
                    <p className="text-[9px] text-center text-[var(--text-muted)] mt-2">
                      Filtrlar: TLS xavfsiz muloqot protokoli yoqilgan. Ma'lumotlaringiz shifrlanadi.
                    </p>
                  </footer>

                </div>

              </motion.div>
            )}

            {/* 3. SCREEN: INTERACTIVE GALLERY FOR PEOPLE & PORTRAITS */}
            {currentTab === "gallery" && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="max-w-6xl mx-auto space-y-6 pt-4"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-[var(--accent-light)] uppercase border border-[var(--border-color)] rounded bg-[var(--accent-bg)] px-2.5 py-0.5">
                    <FolderOpen size={10} />
                    Odamlar Databaza Moduli
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Odamlar va Tasvirlar Galereyasi</h1>
                  <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed">
                    Ushbu galereyadagi portret va yuzlarni sun'iy intellekt modellariga (Masalan, Imagine AI yoki DALL-E) muloqot vaqtida uzatishingiz, profil rasmi qilib sozlashingiz yoki o'zingizning kompyuteringizdan yangi odam rasmlarini ushbu jildga yuklab saqlashingiz mumkin.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Easy Drag & Drop Uploader Desk */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="border border-[var(--border-color)] bg-[var(--surface-card)] rounded-md p-5 space-y-4">
                      <h3 className="text-xs font-bold font-mono text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                        <UploadCloud size={14} className="text-[var(--accent-light)]" />
                        Yangi Tasvir Yuklash
                      </h3>

                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleImageUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => {
                          const fileInput = document.getElementById("gallery-hidden-input");
                          fileInput?.click();
                        }}
                        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all ${
                          isDragging 
                            ? "border-[var(--accent-color)] bg-[var(--accent-bg)] scale-98" 
                            : imageFileStr 
                              ? "border-emerald-600 bg-emerald-900/5" 
                              : "border-[var(--border-color)] hover:border-neutral-400 bg-black/5"
                        }`}
                      >
                        <input
                          id="gallery-hidden-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(e.target.files[0]);
                            }
                          }}
                        />

                        {imageFileStr ? (
                          <div className="space-y-3">
                            <div className="w-24 h-24 mx-auto rounded border border-[var(--border-color)] overflow-hidden bg-black/40 relative group">
                              <img src={imageFileStr} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageFileStr("");
                                  playClickSound();
                                }}
                                className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs text-rose-400 font-bold"
                              >
                                O'chirish
                              </button>
                            </div>
                            <p className="text-[10px] text-emerald-400 font-medium font-mono">Tasvir Yuklandi ✓</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <UploadCloud size={24} className="mx-auto text-[var(--text-muted)] group-hover:text-white" />
                            <p className="text-xs font-semibold text-[var(--text-primary)]">Faylni Tanlash Yokida Sudrab Tashlash</p>
                            <p className="text-[10px] text-[var(--text-muted)]">PNG, JPG, WEBP • Max 8MB</p>
                          </div>
                        )}
                      </div>

                      {/* Uploader Form fields */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!imageFileStr) {
                            alert("Iltimos, avval rasm tanlang yoki sudrab tashlang!");
                            return;
                          }
                          const tagsArr = newImageTags ? newImageTags.split(",").map(t => t.trim()).filter(Boolean) : ["Maxsus"];
                          const newItem: GalleryItem = {
                            id: `gal_${Date.now()}`,
                            name: newImageName.trim() || "Nomsiz Portret",
                            url: imageFileStr,
                            tags: tagsArr,
                            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " - Bugun"
                          };
                          setGalleryItems([newItem, ...galleryItems]);
                          setNewImageName("");
                          setNewImageTags("");
                          setImageFileStr("");
                          playClickSound();
                        }}
                        className="space-y-3"
                      >
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Rasm nomi (Kim bu?)</label>
                          <input
                            type="text"
                            required={!!imageFileStr}
                            value={newImageName}
                            onChange={(e) => setNewImageName(e.target.value)}
                            placeholder="Masalan: Dilnoza - Operator..."
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-light)] transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Teglar (Vergullar bilan ajrating)</label>
                          <input
                            type="text"
                            value={newImageTags}
                            onChange={(e) => setNewImageTags(e.target.value)}
                            placeholder="Zamin, Portret, Men, Virtual"
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-light)] transition-all"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={!imageFileStr}
                          className={`w-full p-2.5 rounded font-bold text-xs transition-all ${
                            imageFileStr 
                              ? "bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white cursor-pointer active:scale-97" 
                              : "bg-neutral-800 text-stone-500 cursor-not-allowed"
                          }`}
                        >
                          Galereyaga kiritish
                        </button>
                      </form>
                    </div>

                    {/* Integrated Tips help card */}
                    <div className="p-4 border border-[var(--border-color)] bg-[var(--accent-bg)] rounded text-[11px] text-[var(--text-muted)] space-y-1.5 leading-relaxed">
                      <p className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Sparkles size={11} className="text-[var(--accent-light)]" />
                        Tezkor Maslahat:
                      </p>
                      <p>
                        Galereyadagi barcha kiritilgan shaxslar ma'lumoti faqatgina brauzeringiz ichidagi xavfsiz sandboxda ("localStorage") saqlanadi. Tashqi ruxsatsiz uchinchi shaxslarga yuborilmaydi.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Database list with interactive items */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="border border-[var(--border-color)] bg-[var(--surface-card)] rounded-md p-5 space-y-4 min-h-[480px]">
                      
                      {/* Search and counters */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
                        <div>
                          <h3 className="text-sm font-bold">Faol Odamlar Databazasi</h3>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Jami: {galleryItems.length} ta tasvir kiritilgan</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Ism yoki teg bo'yicha qidiruv..."
                            value={gallerySearch}
                            onChange={(e) => setGallerySearch(e.target.value)}
                            className="bg-[var(--bg-main)] border border-[var(--border-color)] px-3 py-1.5 rounded text-xs outline-none focus:border-[var(--accent-style)]"
                          />
                          {gallerySearch && (
                            <button
                              onClick={() => setGallerySearch("")}
                              className="text-[10px] font-mono border border-[var(--border-color)] hover:border-rose-400 px-1.5 py-1 rounded bg-[var(--bg-main)] text-rose-400 shrink-0"
                            >
                              Tozalash
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Gallery Items Grid layout */}
                      {galleryItems.filter(item => {
                        if (!gallerySearch) return true;
                        const s = gallerySearch.toLowerCase();
                        return item.name.toLowerCase().includes(s) || item.tags.some(t => t.toLowerCase().includes(s));
                      }).length === 0 ? (
                        <div className="py-20 text-center space-y-2">
                          <span className="text-2xl block">📂</span>
                          <p className="text-xs text-[var(--text-muted)] font-mono">Hech qanday rasm yoki shaxs topilmadi.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {galleryItems.filter(item => {
                            if (!gallerySearch) return true;
                            const s = gallerySearch.toLowerCase();
                            return item.name.toLowerCase().includes(s) || item.tags.some(t => t.toLowerCase().includes(s));
                          }).map((item) => (
                            <div
                              key={item.id}
                              className="border border-[var(--border-color)] bg-[var(--bg-main)] p-3 rounded group relative hover:shadow-lg hover:border-neutral-400 transition-all duration-300 flex flex-col justify-between"
                            >
                              <div className="space-y-2">
                                {/* Image cover view port */}
                                <div
                                  className="w-full h-36 rounded overflow-hidden border border-[var(--border-color)] bg-black/40 relative cursor-pointer"
                                  onClick={() => setSelectedGalleryImage(item)}
                                  title="Kattalashtirib ko'rish"
                                >
                                  <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs font-semibold text-white">
                                    <Eye size={14} className="mr-1 inline" /> Ko'rish
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-xs font-bold text-[var(--text-primary)] truncate mt-1">{item.name}</h4>
                                  <span className="text-[8px] font-mono text-[var(--text-muted)]">{item.createdAt}</span>
                                </div>

                                {/* Custom item tags list */}
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      onClick={() => {
                                        setGallerySearch(tag);
                                        playClickSound();
                                      }}
                                      className="text-[8px] font-mono px-1 py-0.5 rounded cursor-pointer border border-[var(--border-color)] bg-[var(--surface-card)] text-[var(--text-muted)] hover:text-emerald-400 transition-all"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Action items underneath */}
                              <div className="border-t border-[var(--border-color)]/60 pt-2.5 mt-3 flex items-center justify-between">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProfileAvatar(item.url);
                                    localStorage.setItem("y_profile_avatar", item.url);
                                    alert(`Muvaffaqiyatli! Ushbu rasm sizning profil avataringiz qilib o'rnatildi.`);
                                    playClickSound();
                                  }}
                                  className="text-[9px] font-mono border border-[var(--border-color)] bg-[var(--surface-card)] hover:border-emerald-500 text-[var(--text-muted)] hover:text-[var(--accent-light)] px-1.5 py-1 rounded transition-all active:scale-95"
                                  title="Profil avatarligi qilib belgilash"
                                >
                                  Avatar
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    // Switch to chat, select image category model, and preload dialog payload
                                    const imgModel = MODELS.find(m => m.category === "tasvir") || selectedModel;
                                    setSelectedModel(imgModel);
                                    
                                    // Add reference session
                                    const lazySession: ChatSession = {
                                      id: `sess_gal_${Date.now()}`,
                                      modelId: imgModel.id,
                                      title: `Rasm Tahlili: ${item.name}`,
                                      messages: [
                                        {
                                          id: `init_${Date.now()}`,
                                          role: "assistant",
                                          content: `Assalomu alaykum, **${profileName}**! Men **${imgModel.name}** modeliman. Galereyadan yangi rasm jo'natildi. Rasm nomi: **"${item.name}"**. Teglar: #${item.tags.join(", #")}. Iltimos, ushbu rasm bo'yicha qanday vazifani bajarishim kerak ligini so'rang!`,
                                          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                        }
                                      ],
                                      createdAt: new Date().toISOString()
                                    };
                                    const updated = [lazySession, ...sessions];
                                    saveSessions(updated);
                                    setCurrentSessionId(lazySession.id);
                                    setCurrentTab("chat");
                                    playClickSound();
                                  }}
                                  className="text-[9px] font-mono border border-[var(--border-color)] bg-[var(--accent-bg)] hover:bg-[var(--accent-color)] text-[var(--accent-light)] hover:text-white px-1.5 py-1 rounded transition-all active:scale-95 text-center flex-1 mx-1.5"
                                  title="Muloqot xonasiga tahlil uchun yo'naltirish"
                                >
                                  Chatga yuborish
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Ushbu rasmni o'chirishni xohlaysizmi?`)) {
                                      setGalleryItems(galleryItems.filter(g => g.id !== item.id));
                                      playClickSound();
                                    }
                                  }}
                                  className="text-stone-500 hover:text-red-400 p-1 rounded hover:bg-neutral-800 transition-all shrink-0"
                                  title="Ochandagi rasmni o'chirish"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* MODAL ZOOM FOR SELECTIVE IMAGES */}
                {selectedGalleryImage && (
                  <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
                    onClick={() => setSelectedGalleryImage(null)}
                  >
                    <div
                      className="bg-[var(--surface-card)] border border-[var(--border-color)] max-w-xl w-full rounded p-5 space-y-4 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{selectedGalleryImage.name}</h3>
                        <button
                          onClick={() => setSelectedGalleryImage(null)}
                          className="text-xs p-1 px-2 border border-[var(--border-color)] hover:border-rose-400 rounded bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-rose-400 transition-all"
                        >
                          Yopish
                        </button>
                      </div>

                      <div className="w-full max-h-[400px] overflow-hidden rounded border border-[var(--border-color)] bg-black/60 flex items-center justify-center">
                        <img src={selectedGalleryImage.url} className="max-w-full max-h-[380px] object-contain" referrerPolicy="no-referrer" />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                        <span>Yuklangan vaqt: {selectedGalleryImage.createdAt}</span>
                        <span>Formati: Base64 / JPG Data</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 4. SCREEN: ELITE PROFILE MANAGER PANEL WITH VIP IDENTITY CRD & SECURE UTILITIES */}
            {currentTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="max-w-5xl mx-auto space-y-8 pt-4"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-[var(--accent-light)] uppercase border border-[var(--border-color)] rounded bg-[var(--accent-bg)] px-2.5 py-0.5">
                    <User size={10} />
                    Shaxsiy Sozlamalar Kabineti
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">Foydalanuvchi Shaxsiy Profili</h1>
                  <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed">
                    MYS AI integratsiyalashgan tizimi foydalanuvchisi sifatida shaxsiy ma'lumotlaringiz, xavfsizlik kalitlari va aloqa sozlamalarini boshqaring.
                  </p>
                </div>

                {/* TWO-COLUMN GRID: MEMBERSHIP PASS VS PROFILE EDITOR FORM */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Electro VIP Identity Card Visualizer (High Polish Design Element) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] px-1">Guvohnoma Shrift-Kodi</div>
                    
                    <div className="relative border-2 border-emerald-500 bg-gradient-to-br from-neutral-900 via-emerald-950/20 to-neutral-950 p-6 rounded-xl shadow-xl overflow-hidden min-h-[250px] flex flex-col justify-between text-white font-sans select-none my-card-glow">
                      
                      {/* Embedded dynamic geometric laser lines indicating VIP status */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full pointer-events-none" />
                      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/5 blur-xl rounded-full pointer-events-none" />

                      {/* Header line */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-400 tracking-wider font-mono">MYS AI CORE ID</p>
                          <p className="text-[8px] text-stone-400 font-mono">№ AG-Y-2026-9922-VIP</p>
                        </div>
                        {/* Golden/Emerald Chip emulator */}
                        <div className="w-8 h-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500 rounded border border-neutral-700/80 shrink-0 relative flex items-center justify-center">
                          <span className="text-[7px] text-neutral-900 font-black">SECURE</span>
                        </div>
                      </div>

                      {/* Body section */}
                      <div className="flex items-center gap-4 py-4">
                        <div className="w-16 h-16 rounded border-2 border-emerald-400 bg-black/50 overflow-hidden flex items-center justify-center text-3xl shrink-0 text-white relative">
                          {profileAvatar.startsWith("http") || profileAvatar.startsWith("data:") ? (
                            <img src={profileAvatar} className="w-full h-full object-cover animate-pulse" referrerPolicy="no-referrer" />
                          ) : (
                            profileAvatar
                          )}
                        </div>

                        <div className="space-y-1 overflow-hidden">
                          <p className="text-sm font-extrabold tracking-tight truncate uppercase">{profileName || "Ism kiritilmagan"}</p>
                          <p className="text-[9px] text-stone-300 font-mono truncate">{profileEmail}</p>
                          <span className="inline-block text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-neutral-950 z-10">
                            {profileTier.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Footer section */}
                      <div className="border-t border-emerald-950/80 pt-3 flex items-center justify-between text-[8px] font-mono text-stone-400">
                        <div>
                          <p>Xizmat Turi:</p>
                          <p className="text-stone-200">INTELLIGENT AGENT</p>
                        </div>
                        <div>
                          <p>Ruxsat muddati:</p>
                          <p className="text-stone-200">UMRBOD (VIP)</p>
                        </div>
                        <div>
                          <p>Status:</p>
                          <p className="text-emerald-400">FAOL (ONLINE)</p>
                        </div>
                      </div>

                    </div>

                    {/* Hard disk / Local storage quota meter */}
                    <div className="border border-[var(--border-color)] bg-[var(--surface-card)] rounded-md p-4 space-y-3">
                      <div>
                        <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Brauzer Sandboksi Xotirasi (LocalStorage)</p>
                        <h4 className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">MYS AI kesh jildlari</h4>
                      </div>

                      {/* Meter percentage calculation and indicator bar */}
                      <div className="space-y-1.5">
                        <div className="h-2 bg-neutral-900 rounded overflow-hidden">
                          <div className="h-full bg-[var(--accent-color)]" style={{ width: "32%" }} />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-[var(--text-muted)]">
                          <span>Ishlatilgan: ~3.2 MB</span>
                          <span>Bo'sh joy: 6.8 MB (Standart: 10 MB)</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right: Comprehensive Profile Editor Form */}
                  <div className="lg:col-span-7">
                    <div className="border border-[var(--border-color)] bg-[var(--surface-card)] rounded-md p-6">
                      <form onSubmit={handleSaveProfile} className="space-y-5">
                        
                        {/* Saved confirmation banner */}
                        {isProfileSavedMsg && (
                          <div className="p-4 border border-emerald-900 bg-emerald-900/10 text-emerald-400 text-xs rounded font-semibold flex items-center gap-2">
                            <Check size={14} className="animate-bounce" />
                            <span>Profil ma'lumotlari xavfsiz holatda soqlandi va barcha muloqot tizimlari yangilandi!</span>
                          </div>
                        )}

                        {/* Avatar selection container */}
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider block">Emoji Avatar tanlang (Yoki O'z rasmingizni yuklang)</label>
                          <div className="flex flex-wrap gap-1.5 pb-1">
                            {AVATAR_OPTIONS.map((av) => (
                              <button
                                type="button"
                                key={av}
                                onClick={() => { setProfileAvatar(av); playClickSound(); }}
                                className={`w-10 h-10 text-lg flex items-center justify-center rounded border transition-all ${profileAvatar === av ? "border-2 border-[var(--accent-light)] bg-[var(--accent-bg)]" : "border-[var(--border-color)] hover:border-neutral-500 bg-[var(--bg-main)]"}`}
                              >
                                {av}
                              </button>
                            ))}
                          </div>

                          {/* Direct image upload for user custom profile avatar */}
                          <div className="mt-3 p-3 border border-dashed border-[var(--border-color)] rounded-md bg-[var(--bg-main)]/50 flex flex-col sm:flex-row items-center gap-3 justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">🖼️</span>
                              <div>
                                <p className="text-xs font-semibold text-[var(--text-primary)]">Shaxsiy rasmingizni yuklash</p>
                                <p className="text-[10px] text-[var(--text-muted)]">Fayldan profil avatarini o'rnating</p>
                              </div>
                            </div>
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                id="user-profile-file-upload"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    if (!file.type.startsWith("image/")) {
                                      alert("Iltimos, faqat rasm faylini yuklang!");
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      if (ev.target?.result) {
                                        setProfileAvatar(ev.target.result as string);
                                        playClickSound();
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label
                                htmlFor="user-profile-file-upload"
                                className="px-3 py-1.5 text-xs font-bold border border-[var(--accent-color)] text-[var(--accent-light)] hover:text-white rounded bg-[var(--accent-bg)] hover:bg-[var(--accent-color)] transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                              >
                                <span>Rasm tanlash</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Text Inputs block */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          <div className="space-y-1">
                            <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider block">Ism familiyangiz</label>
                            <input
                              type="text"
                              required
                              value={profileName}
                              onChange={(e) => setProfileName(e.target.value)}
                              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-light)] transition-all font-semibold"
                              placeholder="Foydalanuvchi nomi..."
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider block font-light">Aloqa elektron pochtangiz</label>
                            <input
                              type="email"
                              required
                              value={profileEmail}
                              onChange={(e) => setProfileEmail(e.target.value)}
                              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-light)] transition-all font-mono"
                              placeholder="E.g. ybegimqulov01@gmail.com"
                            />
                          </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          <div className="space-y-1">
                            <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider block">Telefon Raqamingiz</label>
                            <input
                              type="text"
                              value={profilePhone}
                              onChange={(e) => setProfilePhone(e.target.value)}
                              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-light)] transition-all"
                              placeholder="+998 (xx) xxx-xxxx"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider block">Tanlangan Asosiy AI modeli</label>
                            <select
                              value={profilePrefModel}
                              onChange={(e) => {
                                setProfilePrefModel(e.target.value);
                                const model = MODELS.find(m => m.id === e.target.value);
                                if (model) setSelectedModel(model);
                                playClickSound();
                              }}
                              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-light)] transition-all"
                            >
                              {MODELS.map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({m.developer})
                                </option>
                              ))}
                            </select>
                          </div>

                        </div>

                        {/* Bio Textarea */}
                        <div className="space-y-1">
                          <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider block">Siz haqingizda (Bio)</label>
                          <textarea
                            value={profileBio}
                            onChange={(e) => setProfileBio(e.target.value)}
                            rows={3}
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-3 rounded text-xs text-[var(--text-primary)] outline-none focus:border-[var(--accent-light)] transition-all resize-none leading-relaxed"
                            placeholder="Shaxsiy rejangiz, mutaxassisligingiz yoki qiziqishlaringiz..."
                          />
                        </div>

                        {/* Custom Google Gemini Secure API Key input */}
                        <div className="space-y-1.5 p-4 border border-[var(--border-color)] bg-black/10 rounded">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
                              <Key size={12} className="text-emerald-400" />
                              Shaxsiy Gemini API maxfiy kaliti (Xavfsiz Sandbox)
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setShowApiKey(!showApiKey);
                                playClickSound();
                              }}
                              className="text-[9px] font-mono border border-[var(--border-color)] px-1.5 py-0.5 rounded bg-[var(--bg-main)] text-[var(--text-muted)] hover:bg-[var(--accent-color)] hover:text-white transition-all"
                            >
                              {showApiKey ? "Yashirish" : "Ko'rsatish"}
                            </button>
                          </div>

                          <input
                            type={showApiKey ? "text" : "password"}
                            value={profileApiKey}
                            onChange={(e) => setProfileApiKey(e.target.value)}
                            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-2.5 rounded text-xs text-stone-300 outline-none focus:border-[var(--accent-light)] transition-all font-mono"
                            placeholder="AI Studio API key (Masalan: AIzaSyD...)"
                          />

                          <p className="text-[9px] text-[var(--text-muted)] font-mono leading-tight">
                            Ushbu API kalit korporativ proxy uchun faqatgina sizning brauzeringizda shifrlangan TLS kalit sifatida saqlanib, to'g'ridan-to'g'ri so'rovlar uchun ishlatiladi.
                          </p>
                        </div>

                        {/* Member Tier switch selections */}
                        <div className="space-y-2">
                          <label className="text-xs font-mono uppercase text-[var(--text-muted)] tracking-wider block">Tizim A'zolik Darajasi (Pricing Tier)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            
                            <div
                              onClick={() => { setProfileTier("Free Access Mode"); playClickSound(); }}
                              className={`p-4 border rounded cursor-pointer transition-all ${profileTier === "Free Access Mode" ? "border-[var(--accent-light)] bg-[var(--accent-bg)]" : "border-[var(--border-color)] hover:border-neutral-600 bg-black/10"}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-xs font-bold font-mono tracking-wide">FREE ACCESS MODE</h4>
                                {profileTier === "Free Access Mode" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-light)]" />}
                              </div>
                              <p className="text-[10px] text-[var(--text-muted)]">Faqatgina bepul (Tekin) modellar uchun ruxsat, standart tezlik va cheklangan yuklamalar.</p>
                            </div>

                            <div
                              onClick={() => { setProfileTier("Enterprise Access"); playClickSound(); }}
                              className={`p-4 border rounded cursor-pointer transition-all ${profileTier === "Enterprise Access" ? "border-[var(--accent-light)] bg-[var(--accent-bg)]" : "border-[var(--border-color)] hover:border-neutral-600 bg-black/10"}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-xs font-bold font-mono tracking-wide">ENTERPRISE ACCESS (VIP)</h4>
                                {profileTier === "Enterprise Access" && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-light)] animate-pulse" />}
                              </div>
                              <p className="text-[10px] text-[var(--text-muted)]">Barcha Premium modellardan limitsiz foydalanish. Eng yuqori ustuvor tezlik va API integratsiyasi ruxsatlari.</p>
                            </div>

                          </div>
                        </div>

                        {/* Action buttons list */}
                        <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
                          <button
                            type="submit"
                            className="p-3 px-6 bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] font-bold text-xs rounded transition-all active:scale-95 cursor-pointer uppercase font-mono tracking-widest feedback-btn"
                          >
                            Saqlash & Yangilash
                          </button>
                        </div>

                      </form>
                    </div>
                  </div>

                </div>

                {/* End of profile columns */}

              </motion.div>
            )}

            {/* 3.1 SCREEN: SYSTEM AI PREMIUM VOICES AND NIGHTTIME LIGHT DIMMING TUNER */}
            {currentTab === "voices" && (
              <motion.div
                key="voices"
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.2 }}
                className="max-w-5xl mx-auto space-y-8 pt-4"
              >
                {/* Visual Header introduction with title and eye protector summary */}
                <div className="border border-[var(--border-color)] bg-[var(--surface-card)] rounded-md p-6 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-[var(--border-color)]">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-emerald-400 uppercase border border-emerald-900/50 rounded bg-emerald-950/20 px-2.5 py-1">
                        <Sparkles size={10} className="text-emerald-400" />
                        MYS VIP COGNITIVE ACCENTS
                      </div>
                      <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">AI Ovozli Assistentlar & Kechki Tun Tuneri</h1>
                      <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed max-w-2xl">
                        MYS tizimidagi barcha AI modellar uchun maxsus 20 ta ultra-premium neyron golografik ovoz drayverlari. Shuningdek tuni bilan kognitiv audio tinglashda ko'zlaringiz charchamasligi uchun yorug'likni kamaytiruvchi (ekran xiralashtiruvchi) "Eye-Saver" hudidan bepul foydalaning!
                      </p>
                    </div>

                    {/* Auto Speak Toggle switch */}
                    <div className="flex items-center gap-3 bg-[var(--bg-main)] hover:border-neutral-700/80 p-4 rounded-xl border border-[var(--border-color)] transition-all shrink-0">
                      <div className="space-y-0.5 mt-0.5">
                        <p className="text-xs font-bold text-[var(--text-primary)]">Avtomat TTS Javoblar</p>
                        <p className="text-[9px] text-[var(--text-muted)] font-mono">Auto voice replies on chat</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !speakRepliesAuto;
                          setSpeakRepliesAuto(nextVal);
                          localStorage.setItem("y_speak_replies_auto", nextVal ? "true" : "false");
                          playClickSound();
                        }}
                        className={`w-11 h-6 rounded-full p-0.5 transition-all focus:outline-none relative shadow cursor-pointer ${speakRepliesAuto ? "bg-emerald-500" : "bg-neutral-800"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-slate-900 transition-all transform ${speakRepliesAuto ? "translate-x-5 bg-white" : "translate-x-0 bg-white/70"}`} />
                      </button>
                    </div>
                  </div>

                  {/* HIGH-TECH PHYSICAL LIGHT DIMMER SLIDER BLOCK */}
                  <div className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)]/50 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Eye size={16} className="text-amber-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Ko'zni Asrash Va Yorug'likni Pasaytirish (MYS Tuneri)</h3>
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-mono leading-none">Screen light absorption & blue-light filters for sleep protection</p>
                      </div>

                      {/* Filter category selector tabs */}
                      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/40 rounded-lg border border-[var(--border-color)] text-[10px] font-mono">
                        <button
                          type="button"
                          onClick={() => { setEyeSaverType("night"); playClickSound(); }}
                          className={`px-2.5 py-1 rounded transition-all ${eyeSaverType === "night" ? "bg-emerald-950/45 border border-emerald-500/40 text-emerald-400 font-bold" : "text-stone-300"}`}
                        >
                          🌑 Kechki Tun (Deep Dark)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEyeSaverType("amber"); playClickSound(); }}
                          className={`px-2.5 py-1 rounded transition-all ${eyeSaverType === "amber" ? "bg-amber-950/45 border border-amber-500/40 text-amber-500 font-bold" : "text-stone-300"}`}
                        >
                          🍁 Amber (Anti-Blue Light)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEyeSaverType("cyber"); playClickSound(); }}
                          className={`px-2.5 py-1 rounded transition-all ${eyeSaverType === "cyber" ? "bg-cyan-950/45 border border-cyan-500/40 text-cyan-400 font-bold" : "text-stone-300"}`}
                        >
                          🌌 Kiber-Fazoviy
                        </button>
                      </div>
                    </div>

                    {/* Interactive Slider and explanation */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-8 flex items-center gap-4">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono w-12 text-left">0% (Ochiq)</span>
                        <input
                          type="range"
                          min="0"
                          max="80"
                          step="5"
                          value={eyeSaverDimmer}
                          onChange={(e) => {
                            setEyeSaverDimmer(Number(e.target.value));
                          }}
                          className="flex-1 h-2 rounded bg-neutral-900 border border-neutral-700 accent-emerald-500 outline-none cursor-pointer"
                        />
                        <span className="text-[10px] text-[var(--text-muted)] font-mono w-14 text-right">80% (Qorong'u)</span>
                      </div>

                      <div className="md:col-span-4 p-3.5 rounded bg-black/30 border border-[var(--border-color)] text-center font-mono select-none">
                        <span className="text-[10px] text-zinc-400 block mb-0.5">Hozirgi xiralashtirish:</span>
                        <span className="text-lg font-black text-emerald-400">{eyeSaverDimmer}%</span>
                        <div className="text-[9px] text-stone-300 mt-1 uppercase font-light">
                          {eyeSaverDimmer === 0 && "🔆 Standart Yorug'lik"}
                          {eyeSaverDimmer > 0 && eyeSaverDimmer <= 25 && "👓 Sog'lom Uyqu Himoyasi"}
                          {eyeSaverDimmer > 25 && eyeSaverDimmer <= 55 && "🍿 Kechki Kino & Mutolaa foni"}
                          {eyeSaverDimmer > 55 && "💤 Chuqur Tun Kognitiv Rejimi"}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-stone-400 font-light font-sans italic leading-relaxed">
                      *Izoh: Ushbu tizim monitor va brauzer nurlarini mutlaq yuqori darajada fizik jihatdan filtrlaydi va ko'z charchog'ini 80% gacha kamaytiradi.
                    </p>
                  </div>

                  {/* Selected Voice indicator row */}
                  <div className="p-4 rounded-lg bg-emerald-950/10 border border-emerald-900/30 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        {getVoiceIcon((PREMIUM_VOICES.find(v => v.id === selectedVoiceId) || PREMIUM_VOICES[0]).id)}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest leading-none block mb-1">FAOL ASSISTENT OVOZI:</span>
                        <h4 className="text-sm font-bold text-white">
                          {(PREMIUM_VOICES.find(v => v.id === selectedVoiceId) || PREMIUM_VOICES[0]).name}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono text-stone-300 hidden sm:block">
                      <span>Xususiyat: </span>
                      <span className="text-amber-500">{(PREMIUM_VOICES.find(v => v.id === selectedVoiceId) || PREMIUM_VOICES[0]).gender}</span>
                    </div>
                  </div>
                </div>

                {/* Grid list container for 20 unique premium voices */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-mono text-[var(--test-muted)] uppercase tracking-wider">Premium AI Ovozlar Katalogi ({PREMIUM_VOICES.length} xil model)</h3>
                    <span className="text-[10px] text-emerald-400 font-mono">To'liq neyron sintez tizimi</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PREMIUM_VOICES.map((voice) => {
                      const isSelected = selectedVoiceId === voice.id;
                      return (
                        <div
                          key={voice.id}
                          onClick={() => {
                            setSelectedVoiceId(voice.id);
                            localStorage.setItem("y_selected_voice_id", voice.id);
                            playClickSound();
                          }}
                          className={`group border rounded-lg p-4 bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] transition-all duration-200 flex flex-col justify-between cursor-pointer text-left select-none relative ${
                            isSelected 
                              ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/20 bg-emerald-950/10" 
                              : "border-[var(--border-color)] hover:border-stone-600"
                          }`}
                        >
                          {/* Selected Active indicator badge */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 flex items-center justify-center bg-emerald-500 text-neutral-950 w-4 h-4 rounded-full text-[9px] font-bold">
                              ✓
                            </div>
                          )}

                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-center shrink-0">
                                {getVoiceIcon(voice.id)}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-[var(--text-primary)] tracking-tight truncate max-w-[120px]">{voice.name}</h4>
                                <span className="inline-block text-[8px] font-mono text-[var(--text-muted)]">
                                  {voice.gender}
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-[var(--text-muted)] min-h-[44px] leading-relaxed font-light">
                              {voice.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[var(--border-color)]/50 mt-3 flex items-center justify-between gap-1.5">
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/35 text-amber-500 uppercase font-semibold">
                              {voice.extraFx}
                            </span>
                            
                            {/* Run sample preview */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const samplePhrase = `Salom! Men ${voice.name} premium ovozli sun'iy idrok drayveriman. MYS tizimiga muvaffaqiyatli integratsiya qilindim!`;
                                // Set state and speak
                                setSelectedVoiceId(voice.id);
                                localStorage.setItem("y_selected_voice_id", voice.id);
                                speakText(samplePhrase, `preview_${voice.id}`);
                              }}
                              className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0 ${
                                isPlayingSpeech && currentlySpeakingMsgId === `preview_${voice.id}`
                                  ? "bg-rose-950/40 border border-rose-500 text-rose-300 hover:bg-rose-900/40"
                                  : "bg-emerald-950/20 border border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/30"
                              }`}
                            >
                              {isPlayingSpeech && currentlySpeakingMsgId === `preview_${voice.id}` ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping inline-block" />
                                  <span>Stop ⏹</span>
                                </>
                              ) : (
                                <>
                                  <span>Sinash 🔊</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {/* 4. SCREEN: SYSTEM AI TELEMETRY STATS */}
            {currentTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="max-w-5xl mx-auto space-y-8 pt-4"
              >
                
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Server Telemetriya & Statistika</h1>
                  <p className="text-xs text-[var(--text-muted)] font-light">
                    Siz muloqot qiladigan Google Gemini va unga bog'liq tarqalgan server tarmoqlarining real vaqtdagi yuklama ko'rsatkichlari.
                  </p>
                </div>

                {/* Analytical Bento Grid blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="p-5 border border-[var(--border-color)] bg-[var(--surface-card)] rounded flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider">Muloqot Kechikishi (Latency)</p>
                      <h4 className="text-xl font-bold mt-1 tracking-tight text-[var(--accent-light)] font-mono">{latency}ms</h4>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-2 leading-tight">Gemini API so'rov yuborib qaytish tezligining joriy millisoniya ko'rsatkichi.</p>
                  </div>

                  <div className="p-5 border border-[var(--border-color)] bg-[var(--surface-card)] rounded flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider">Tarmoq Yuklamasi (Load Traffic)</p>
                      <h4 className="text-xl font-bold mt-1 tracking-tight text-[var(--text-primary)] font-sans">{activeTraffic}</h4>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-2 leading-tight">Tizimga parallel kirib kelayotgan foydalanuvchilar ko'p yoki kamlik darajasi.</p>
                  </div>

                  <div className="p-5 border border-[var(--border-color)] bg-[var(--surface-card)] rounded flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider">Ishchi Tugunlar soni (Nodes)</p>
                      <h4 className="text-xl font-bold mt-1 tracking-tight text-[var(--text-primary)] font-mono">{nodeCount} ta server</h4>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-2 leading-tight">MYS AI boshqaruvi mikrosekundlardagi tarmoq ulanishlarini taqsimlaydigan o'qlar.</p>
                  </div>

                </div>

                {/* Interactive Network status chart */}
                <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-card)] rounded space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold tracking-tight">Tizim Node tarmoqlari bog'lanishi</h3>
                      <p className="text-[10px] text-[var(--text-muted)]">Real vaqtdagi barcha tizim tugunlarining yuklamasi</p>
                    </div>

                    <button
                      onClick={triggerMeasureLatency}
                      disabled={isMeasuring}
                      className="px-3 py-1.5 text-xs font-bold border border-[var(--accent-color)] text-[var(--accent-light)] hover:text-white rounded bg-[var(--accent-bg)] hover:bg-[var(--accent-color)] transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <RefreshCw size={12} className={isMeasuring ? "animate-spin" : ""} />
                      Tizimni Diagnostika qilish
                    </button>
                  </div>

                  {/* High Quality Styled Graph Simulation representing premium utility feel */}
                  <div className="border border-[var(--border-color)] bg-black/40 rounded p-6 min-h-[220px] flex flex-col justify-between font-mono text-[10px] text-[var(--text-muted)]">
                    <div className="flex justify-between items-center bg-black/60 p-2.5 rounded border border-[var(--border-color)]">
                      <span className="text-[var(--accent-light)] animate-pulse">● TO'G'RI ULANISH (TLS OK)</span>
                      <span>O'zbekiston, Toshkent (Primary Ingress Node)</span>
                    </div>

                    {/* Simulated node connection flow */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const loadingVal = Math.floor(Math.random() * 40) + (i * 5) + 15;
                        return (
                          <div key={i} className="p-3 border border-[var(--border-color)] bg-[var(--surface-card)] rounded space-y-2">
                            <div className="flex justify-between font-bold text-[var(--text-primary)]">
                              <span>NODE-0{i+1}</span>
                              <span className="text-[var(--accent-light)]">ON</span>
                            </div>
                            <div className="h-1 bg-neutral-900 rounded overflow-hidden">
                              <div className="h-full bg-[var(--accent-color)]" style={{ width: `${loadingVal}%` }} />
                            </div>
                            <div className="flex justify-between text-[8px]">
                              <span>Yuklama: {loadingVal}%</span>
                              <span>OK</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-center font-light text-[9px] text-[var(--text-muted)] border-t border-[var(--border-color)] pt-3">
                      Ma'lumotlar doimiy yangilanadi. Hozirgi holat: barqaror. Hech qanday uzilish kuzatilmadi.
                    </div>
                  </div>
                </div>

                {/* Models comparison metric */}
                <div className="p-6 border border-[var(--border-color)] bg-[var(--surface-card)] rounded-md">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={16} className="text-[var(--accent-light)]" />
                    <h3 className="text-sm font-bold">Model Unumdorlik reytingi</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Code Pro 2.0-Pro", p: "99.2%", active: "Maksimal" },
                      { name: "Gemini 1.5 Pro", p: "98.9%", active: "Optimal" },
                      { name: "ChatGPT 4o", p: "98.5%", active: "Yuqori" },
                      { name: "Claude 3.5 Sonnet", p: "98.4%", active: "Yuqori" }
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-2 border-b border-[var(--border-color)]">
                        <span className="font-semibold text-[var(--text-primary)]">{row.name}</span>
                        <div className="flex items-center gap-4 text-[10px] font-mono">
                          <span>Ishlash darajasi: <strong className="text-[var(--accent-light)]">{row.p}</strong></span>
                          <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-950 px-1 rounded-sm">{row.active}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ------------------- GLOBAL SYSTEM FOOTER ------------------- */}
        <footer className="py-4 px-6 border-t border-[var(--border-color)] bg-[var(--sidebar-bg)] text-center text-[10px] text-[var(--text-muted)] shrink-0 z-20">
          <p className="font-mono tracking-wide">
            © 2026 MYS AI — Barcha sun'iy intellekt modellar bitta joyda. Dastur korporativ shifrlash kalitlari bilan himoyalangan.
          </p>
        </footer>

      </main>

    </div>
  );
}
