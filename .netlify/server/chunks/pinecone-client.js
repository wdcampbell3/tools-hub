import { Pinecone } from "@pinecone-database/pinecone";
import { d as private_env } from "./shared-server.js";
const PRIVATE_PINECONE_API_KEY = private_env.PRIVATE_PINECONE_API_KEY;
if (!PRIVATE_PINECONE_API_KEY) {
  console.error("PRIVATE_PINECONE_API_KEY is not set in environment variables");
  throw new Error(
    "PRIVATE_PINECONE_API_KEY is not set in environment variables"
  );
}
console.log("Initializing Pinecone client...");
const pinecone = new Pinecone({
  apiKey: PRIVATE_PINECONE_API_KEY
});
console.log("Pinecone client initialized successfully");
const INDEX_NAME = "meeting-assistant";
function getIndex() {
  return pinecone.index(INDEX_NAME);
}
export {
  getIndex as g,
  pinecone as p
};
