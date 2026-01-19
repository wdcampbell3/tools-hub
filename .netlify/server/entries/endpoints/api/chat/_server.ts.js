import { e as error } from "../../../../chunks/index2.js";
import { g as getIndex, p as pinecone } from "../../../../chunks/pinecone-client.js";
import OpenAI from "openai";
import { d as private_env } from "../../../../chunks/shared-server.js";
const OPENROUTER_API_KEY = private_env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.warn(
    "OPENROUTER_API_KEY is not set. Meeting Assistant will not function."
  );
}
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://saasstarter.com",
    // Optional: Replace with your site URL
    "X-Title": "SaaS Starter Meeting Assistant"
    // Optional: Replace with your site name
  }
});
const POST = async ({ request }) => {
  try {
    const { message, model, meetingIds } = await request.json();
    if (!message) {
      throw error(400, "Message is required");
    }
    const selectedModel = model || "google/gemini-2.5-flash";
    console.log("Chat request:", { message, model: selectedModel, meetingIds });
    const index = getIndex();
    const namespace = index.namespace("meeting-transcripts");
    let filter = {};
    let minDate = null;
    let maxDate = null;
    if (meetingIds && Array.isArray(meetingIds) && meetingIds.length > 0) {
      filter = {
        message_id: { $in: meetingIds }
      };
    } else {
      const now = /* @__PURE__ */ new Date();
      const lowerMessage = message.toLowerCase();
      const daysMatch = lowerMessage.match(
        /(?:last|past|previous)\s+(\d+)\s*days?/
      );
      if (daysMatch) {
        minDate = /* @__PURE__ */ new Date();
        minDate.setDate(now.getDate() - parseInt(daysMatch[1]));
      } else if (/(?:last|past|this|over the last|in the past)\s*week/.test(lowerMessage)) {
        minDate = /* @__PURE__ */ new Date();
        minDate.setDate(now.getDate() - 7);
      } else if (/(?:last|past)\s*(?:2|two)\s*weeks/.test(lowerMessage)) {
        minDate = /* @__PURE__ */ new Date();
        minDate.setDate(now.getDate() - 14);
      } else if (/(?:last|past|this|over the last|in the past)\s*month/.test(
        lowerMessage
      )) {
        minDate = /* @__PURE__ */ new Date();
        minDate.setDate(now.getDate() - 30);
      } else if (lowerMessage.match(/(?:last|past)\s+(\d+)\s*months?/)) {
        const monthsMatch = lowerMessage.match(
          /(?:last|past)\s+(\d+)\s*months?/
        );
        if (monthsMatch) {
          minDate = /* @__PURE__ */ new Date();
          minDate.setMonth(now.getMonth() - parseInt(monthsMatch[1]));
        }
      } else if (/\btoday\b/.test(lowerMessage)) {
        minDate = /* @__PURE__ */ new Date();
        minDate.setHours(0, 0, 0, 0);
      } else if (/\byesterday\b/.test(lowerMessage)) {
        minDate = /* @__PURE__ */ new Date();
        minDate.setDate(now.getDate() - 1);
        minDate.setHours(0, 0, 0, 0);
        maxDate = /* @__PURE__ */ new Date();
        maxDate.setHours(0, 0, 0, 0);
      } else if (/\brecently\b/.test(lowerMessage)) {
        minDate = /* @__PURE__ */ new Date();
        minDate.setDate(now.getDate() - 14);
      }
      const dateMatch = message.match(/\b(\d{4}-\d{2}-\d{2})\b/);
      if (dateMatch) {
        minDate = new Date(dateMatch[1]);
        maxDate = new Date(dateMatch[1]);
        maxDate.setDate(maxDate.getDate() + 1);
      }
      console.log(
        "Date filter:",
        minDate ? `>= ${minDate.toISOString()}` : "none",
        maxDate ? `< ${maxDate.toISOString()}` : "",
        "Message:",
        message.substring(0, 50)
      );
    }
    const embeddingResults = await pinecone.inference.embed(
      "llama-text-embed-v2",
      [message],
      // Use actual user query for better semantic retrieval
      { inputType: "query" }
    );
    let queryVector;
    if (Array.isArray(embeddingResults) && embeddingResults.length > 0) {
      queryVector = embeddingResults[0].values;
    } else if (embeddingResults && typeof embeddingResults === "object" && "data" in embeddingResults) {
      queryVector = embeddingResults.data[0].values;
    } else {
      queryVector = new Array(1024).fill(0.1);
    }
    const queryOptions = {
      vector: queryVector,
      topK: 1e4,
      // Fetch up to 10000 chunks to ensure we get ALL meetings
      includeMetadata: true,
      // Only use meetingIds filter, date filtering is done post-query
      filter: Object.keys(filter).length > 0 ? filter : void 0
    };
    const queryResponse = await namespace.query(queryOptions);
    console.log(
      "Pinecone matches found:",
      queryResponse.matches?.length,
      "unique meetings will be assembled next"
    );
    const meetingChunksMap = /* @__PURE__ */ new Map();
    queryResponse.matches.forEach((match) => {
      const metadata = match.metadata || {};
      const messageId = String(metadata.message_id || "unknown");
      if (!meetingChunksMap.has(messageId)) {
        meetingChunksMap.set(messageId, []);
      }
      meetingChunksMap.get(messageId).push({
        ...metadata,
        score: match.score
      });
    });
    let meetings = Array.from(meetingChunksMap.entries()).map(([messageId, chunks]) => {
      const firstChunk = chunks[0];
      chunks.sort((a, b) => (a.chunk_index || 0) - (b.chunk_index || 0));
      const fullText = chunks.map((c) => c.text || "").join("\n");
      const maxScore = Math.max(...chunks.map((c) => c.score || 0));
      return {
        message_id: messageId,
        meeting_name: firstChunk.meeting_name || "Unknown Meeting",
        meeting_date: firstChunk.meeting_date || (/* @__PURE__ */ new Date()).toISOString(),
        chunks,
        fullText,
        maxScore
      };
    }).sort((a, b) => b.maxScore - a.maxScore);
    if (minDate || maxDate) {
      const beforeCount = meetings.length;
      meetings = meetings.filter((m) => {
        const meetingDate = new Date(m.meeting_date);
        if (minDate && meetingDate < minDate) return false;
        if (maxDate && meetingDate >= maxDate) return false;
        return true;
      });
      console.log(
        `Date filter applied: ${beforeCount} -> ${meetings.length} meetings`
      );
    }
    let effectiveMeetings = meetings;
    if (Object.keys(filter).length === 0) {
      effectiveMeetings = meetings.slice(0, 20);
    }
    effectiveMeetings.sort(
      (a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime()
    );
    const contextText = effectiveMeetings.map(
      (m, i) => `
[Meeting #${i + 1}]
Name: ${m.meeting_name}
Date: ${m.meeting_date}
Full Transcript:
${m.fullText}
`
    ).join("\n\n" + "=".repeat(50) + "\n\n");
    console.log(
      `Context assembled: ${effectiveMeetings.length} meetings, ~${contextText.length} chars.`
    );
    const systemPrompt = `You are a Context-Aware Meeting Analyst.
You have access to the COMPLETE transcripts of the following ${effectiveMeetings.length} meetings:

${effectiveMeetings.map((m) => `- ${m.meeting_name} (${m.meeting_date})`).join("\n")}

INSTRUCTIONS:
1. Answer the user's question based ONLY on the provided transcripts.
2. Synthesize information across multiple meetings when asked for "overview", "trends", or "summary".
3. CRITICAL: Do NOT include raw source text or long quotes in your response. Summarize and synthesize only.
4. CITATIONS FORMAT (VERY IMPORTANT):
   - For EACH source, use exactly this format: [[Meeting Name, YYYY-MM-DD]]
   - Example: [[Strategy Sync, 2023-10-12]]
   - For MULTIPLE sources, use SEPARATE brackets: [[Meeting A, 2023-01-01]] [[Meeting B, 2023-01-02]]
   - NEVER combine sources in one bracket like [[A], [B]] - this is WRONG
   - NEVER list sources at the end - place citations inline where the information is mentioned
5. If the info is not in the transcripts, say so.
6. You are seeing the FULL conversation, not just snippets. Use this to explain context, tone, and full decisions.
7. USER CONTEXT: The user is a participant/owner of ALL provided meetings. When the user asks about "my meeting", "my leadership", or "me", assume they are referring to the content within these transcripts. 
   - The user is likely the speaker identified as "Douglas", "Doug", "Douglas Campbell", or similar variants.
   - For questions about soft skills (e.g., "leadership style", "communication"), ANALYZE the user's spoken lines, tone, and decisions within the transcripts. INFER attributes from their behavior; do not just look for explicit text mentioning "leadership".

CONTEXT:
${contextText}`;
    const sources = effectiveMeetings.map((m, i) => ({
      id: i + 1,
      meeting_name: m.meeting_name,
      meeting_date: m.meeting_date,
      message_id: m.message_id,
      chunk_count: m.chunks.length,
      text: m.fullText,
      preview: m.fullText.substring(0, 300) + "..."
    }));
    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      stream: true,
      stream_options: { include_usage: true }
    });
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const sourcesMessage = `__SOURCES__${JSON.stringify(sources)}__END_SOURCES__
`;
          controller.enqueue(new TextEncoder().encode(sourcesMessage));
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) controller.enqueue(new TextEncoder().encode(content));
            if (chunk.usage) {
              const usageMessage = `
__USAGE__${JSON.stringify(chunk.usage)}__END_USAGE__`;
              controller.enqueue(new TextEncoder().encode(usageMessage));
            }
          }
          controller.close();
        } catch (e) {
          console.error("Streaming error:", e);
          controller.error(e);
        }
      }
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  } catch (err) {
    console.error("Chat API Error:", err);
    throw error(500, err.message || "Internal Server Error");
  }
};
export {
  POST
};
