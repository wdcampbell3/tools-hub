import { Pinecone } from "@pinecone-database/pinecone"
import { env } from "$env/dynamic/private"

const PRIVATE_PINECONE_API_KEY = env.PRIVATE_PINECONE_API_KEY

if (!PRIVATE_PINECONE_API_KEY) {
  console.error("PRIVATE_PINECONE_API_KEY is not set in environment variables")
  throw new Error(
    "PRIVATE_PINECONE_API_KEY is not set in environment variables",
  )
}

console.log("Initializing Pinecone client...")
export const pinecone = new Pinecone({
  apiKey: PRIVATE_PINECONE_API_KEY,
})
console.log("Pinecone client initialized successfully")

export const INDEX_NAME = "meeting-assistant"

// Helper to get the index directly
export function getIndex() {
  return pinecone.index(INDEX_NAME)
}
