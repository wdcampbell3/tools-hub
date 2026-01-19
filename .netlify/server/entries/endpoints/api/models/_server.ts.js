import { j as json } from "../../../../chunks/index2.js";
const ALLOWED_MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "google/gemini-3-flash-preview", name: "Gemini 3 Flash Preview" },
  { id: "anthropic/claude-sonnet-4.5", name: "Claude Sonnet 4.5" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
  { id: "openai/gpt-5.2", name: "GPT-5.2" }
];
const GET = async () => {
  return json({ models: ALLOWED_MODELS });
};
export {
  GET
};
