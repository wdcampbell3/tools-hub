import OpenAI from "openai"
import { env } from "$env/dynamic/private"

const OPENROUTER_API_KEY = env.OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
  // We might want to just log a warning here if we want the app to start without it,
  // but for this specific feature it's critical.
  console.warn(
    "OPENROUTER_API_KEY is not set. Meeting Assistant will not function.",
  )
}

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://saasstarter.com", // Optional: Replace with your site URL
    "X-Title": "SaaS Starter Meeting Assistant", // Optional: Replace with your site name
  },
})

export type ModelOption = {
  id: string
  name: string
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)" },
  { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5" },
  { id: "anthropic/claude-3-5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
]
