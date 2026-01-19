import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

// User-defined restricted model list
const ALLOWED_MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "google/gemini-3-flash-preview", name: "Gemini 3 Flash Preview" },
  { id: "anthropic/claude-sonnet-4.5", name: "Claude Sonnet 4.5" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
  { id: "openai/gpt-5.2", name: "GPT-5.2" },
]

export const GET: RequestHandler = async () => {
  // Return only the allowed models
  return json({ models: ALLOWED_MODELS })
}
