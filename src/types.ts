export type ModelID = 
  | "gemini" 
  | "gemini-pro"
  | "claude" 
  | "claude-haiku" 
  | "chatgpt" 
  | "chatgpt-mini"
  | "deepseek"
  | "code" 
  | "qwen-code"
  | "image"
  | "dalle"
  | "stable-diffusion";

export interface Model {
  id: ModelID;
  name: string;
  developer: string;
  description: string;
  category: "chat" | "tasvir" | "kodlash";
  version: string;
  accuracy: string;
  isPremium: boolean;
}

export interface Category {
  id: "chat" | "tasvir" | "kodlash";
  name: string;
  description: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  type: "image" | "document";
  size: string;
  content: string; // Base64 coding or file text content
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachedFiles?: AttachedFile[];
}

export interface ChatSession {
  id: string;
  modelId: ModelID;
  title: string;
  messages: Message[];
  createdAt: string;
}
