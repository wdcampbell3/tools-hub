import { j as json } from "../../../../chunks/index2.js";
import { g as getIndex } from "../../../../chunks/pinecone-client.js";
const GET = async () => {
  try {
    const index = getIndex();
    const dummyVector = new Array(1024).fill(0);
    const queryResponse = await index.namespace("meeting-transcripts").query({
      vector: dummyVector,
      topK: 1e3,
      includeMetadata: true
    });
    const meetingsMap = /* @__PURE__ */ new Map();
    queryResponse.matches.forEach((match) => {
      const metadata = match.metadata || {};
      const messageId = metadata.message_id;
      if (messageId && !meetingsMap.has(messageId)) {
        meetingsMap.set(messageId, {
          message_id: messageId,
          meeting_name: metadata.meeting_name || "Unknown meeting",
          meeting_date: metadata.meeting_date || "Unknown date"
        });
      }
    });
    const meetings = Array.from(meetingsMap.values()).sort((a, b) => {
      const dateA = new Date(a.meeting_date);
      const dateB = new Date(b.meeting_date);
      return dateB.getTime() - dateA.getTime();
    });
    return json({ meetings });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return json({ meetings: [] });
  }
};
export {
  GET
};
