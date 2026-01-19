import { error } from "@sveltejs/kit"
import { pinecone, getIndex } from "$lib/server/pinecone-client"
import { openai } from "$lib/server/llm"
import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async ({ request }) => {
  try {
    const requestParams = await request.json()
    const { message, model, meetingIds } = requestParams

    if (!message) {
      throw error(400, "Message is required")
    }

    // Default to Gemini 2.5 Flash
    const selectedModel = model || "google/gemini-2.5-flash"
    console.log("Chat request:", { message, model: selectedModel, meetingIds })

    // --- STRATEGY: CONTEXT-FIRST RAG ---
    // 1. Identify Scope: Did user select meetings? Or ask about a date range?
    // 2. Fetch Metadata: Query Pinecone for ALL meeting chunks matching scope.
    // 3. Assemble: Reconstruct full transcripts.
    // 4. Sythesize: Feed full texts to LLM.

    const index = getIndex()
    const namespace = index.namespace("meeting-transcripts")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let filter: Record<string, any> = {}

    // Store date cutoff for post-filtering (Pinecone doesn't support string date comparisons)
    let minDate: Date | null = null
    let maxDate: Date | null = null

    // 1. Scope Identification

    if (meetingIds && Array.isArray(meetingIds) && meetingIds.length > 0) {
      // Explicit Selection
      filter = {
        message_id: { $in: meetingIds },
      }
    } else {
      // Implicit Selection (Date parsing)
      const now = new Date()
      const lowerMessage = message.toLowerCase()

      // Match various time expressions
      // Last X days patterns
      const daysMatch = lowerMessage.match(
        /(?:last|past|previous)\s+(\d+)\s*days?/,
      )
      if (daysMatch) {
        minDate = new Date()
        minDate.setDate(now.getDate() - parseInt(daysMatch[1]))
      }
      // Last week / past week / over the last week / this week
      else if (
        /(?:last|past|this|over the last|in the past)\s*week/.test(lowerMessage)
      ) {
        minDate = new Date()
        minDate.setDate(now.getDate() - 7) // Explicitly 7 days per user request
      }
      // Last 2 weeks / two weeks
      else if (/(?:last|past)\s*(?:2|two)\s*weeks/.test(lowerMessage)) {
        minDate = new Date()
        minDate.setDate(now.getDate() - 14)
      }
      // Last month / past month / over the last month
      else if (
        /(?:last|past|this|over the last|in the past)\s*month/.test(
          lowerMessage,
        )
      ) {
        minDate = new Date()
        minDate.setDate(now.getDate() - 30) // Explicitly 30 days per user request
      }
      // Last X months
      else if (lowerMessage.match(/(?:last|past)\s+(\d+)\s*months?/)) {
        const monthsMatch = lowerMessage.match(
          /(?:last|past)\s+(\d+)\s*months?/,
        )
        if (monthsMatch) {
          minDate = new Date()
          minDate.setMonth(now.getMonth() - parseInt(monthsMatch[1]))
        }
      }
      // Today
      else if (/\btoday\b/.test(lowerMessage)) {
        minDate = new Date()
        minDate.setHours(0, 0, 0, 0)
      }
      // Yesterday
      else if (/\byesterday\b/.test(lowerMessage)) {
        minDate = new Date()
        minDate.setDate(now.getDate() - 1)
        minDate.setHours(0, 0, 0, 0)
        maxDate = new Date()
        maxDate.setHours(0, 0, 0, 0)
      }
      // Recently = last 14 days
      else if (/\brecently\b/.test(lowerMessage)) {
        minDate = new Date()
        minDate.setDate(now.getDate() - 14) // Explicitly 14 days per user request
      }

      // Specific date match (YYYY-MM-DD)
      const dateMatch = message.match(/\b(\d{4}-\d{2}-\d{2})\b/)
      if (dateMatch) {
        minDate = new Date(dateMatch[1])
        maxDate = new Date(dateMatch[1])
        maxDate.setDate(maxDate.getDate() + 1)
      }

      console.log(
        "Date filter:",
        minDate ? `>= ${minDate.toISOString()}` : "none",
        maxDate ? `< ${maxDate.toISOString()}` : "",
        "Message:",
        message.substring(0, 50),
      )
    }

    // 2. Fetch Metadata (Metadata-only query to get list of relevant chunks)
    // We use a dummy vector (all zeros) just to trigger the filter query
    // TopK needs to be large enough to catch ALL chunks of ALL relevant meetings.
    // Gemini 1.5 Flash has 1M context.
    // 100 meetings * ~10 chunks = 1000 chunks. Safe to set high topK.

    // Actually, we should check embedding dimension. Standard llama-v2 is 384?
    // Wait, line 23 said `llama-text-embed-v2`. Pinecone usually 1024 or 1536 or 768 or 384.
    // To be safe, we should probably generate a real query vector or just known dimension.
    // Use a comprehensive query text that's likely to match meeting content broadly

    const embeddingResults = await pinecone.inference.embed(
      "llama-text-embed-v2",
      [message], // Use actual user query for better semantic retrieval
      { inputType: "query" },
    )

    let queryVector
    if (Array.isArray(embeddingResults) && embeddingResults.length > 0) {
      queryVector = embeddingResults[0].values
    } else if (
      embeddingResults &&
      typeof embeddingResults === "object" &&
      "data" in embeddingResults
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryVector = (embeddingResults as any).data[0].values
    } else {
      // Fallback to dummy if embedding fails, but this likely errors.
      queryVector = new Array(1024).fill(0.1)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryOptions: any = {
      vector: queryVector,
      topK: 10000, // Fetch up to 10000 chunks to ensure we get ALL meetings
      includeMetadata: true,
      // Only use meetingIds filter, date filtering is done post-query
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    }

    const queryResponse = await namespace.query(queryOptions)
    console.log(
      "Pinecone matches found:",
      queryResponse.matches?.length,
      "unique meetings will be assembled next",
    )

    // 3. Assemble Full Transcripts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meetingChunksMap = new Map<string, any[]>()

    queryResponse.matches.forEach((match) => {
      const metadata = match.metadata || {}
      const messageId = String(metadata.message_id || "unknown")

      if (!meetingChunksMap.has(messageId)) {
        meetingChunksMap.set(messageId, [])
      }
      meetingChunksMap.get(messageId)!.push({
        ...metadata,
        score: match.score,
      })
    })

    // Convert key-value map to array of meetings
    let meetings = Array.from(meetingChunksMap.entries())
      .map(([messageId, chunks]) => {
        // Determine meeting details from first chunk
        const firstChunk = chunks[0]
        // Sort chunks by index to reconstruct order
        chunks.sort((a, b) => (a.chunk_index || 0) - (b.chunk_index || 0))
        // Join text
        const fullText = chunks.map((c) => c.text || "").join("\n") // Join with newline

        // Calculate relevance score (max of chunks)
        const maxScore = Math.max(...chunks.map((c) => c.score || 0))

        return {
          message_id: messageId,
          meeting_name: firstChunk.meeting_name || "Unknown Meeting",
          meeting_date: firstChunk.meeting_date || new Date().toISOString(),
          chunks: chunks,
          fullText: fullText,
          maxScore,
        }
      })
      .sort((a, b) => b.maxScore - a.maxScore) // Sort by relevance (Semantic RAG)

    // 3b. Apply date filtering (post-query since Pinecone doesn't support string date comparisons)
    if (minDate || maxDate) {
      const beforeCount = meetings.length
      meetings = meetings.filter((m) => {
        const meetingDate = new Date(m.meeting_date)
        if (minDate && meetingDate < minDate) return false
        if (maxDate && meetingDate >= maxDate) return false
        return true
      })
      console.log(
        `Date filter applied: ${beforeCount} -> ${meetings.length} meetings`,
      )
    }

    // Safety Cap: If NO filter was applied, we might have 500 meetings.
    // Take top 20 most recent if no specific filter? Or relies on topK=2000 limit?
    // Let's cap at 20 most recent meetings for "general" queries to ensure quality/speed.
    let effectiveMeetings = meetings
    if (Object.keys(filter).length === 0) {
      effectiveMeetings = meetings.slice(0, 20)
    }

    // Re-sort by date (Newest -> Oldest) for temporal clarity in context
    effectiveMeetings.sort(
      (a, b) =>
        new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime(),
    )

    // 4. Construct Context
    const contextText = effectiveMeetings
      .map(
        (m, i) => `
[Meeting #${i + 1}]
Name: ${m.meeting_name}
Date: ${m.meeting_date}
Full Transcript:
${m.fullText}
`,
      )
      .join("\n\n" + "=".repeat(50) + "\n\n")

    console.log(
      `Context assembled: ${effectiveMeetings.length} meetings, ~${contextText.length} chars.`,
    )

    // 5. System Prompt
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
${contextText}`

    // 6. Stream Response
    // Prepare sources for frontend (metadata + full text preview)
    const sources = effectiveMeetings.map((m, i) => ({
      id: i + 1,
      meeting_name: m.meeting_name,
      meeting_date: m.meeting_date,
      message_id: m.message_id,
      chunk_count: m.chunks.length,
      text: m.fullText,
      preview: m.fullText.substring(0, 300) + "...",
    }))

    // Parse history (if provided)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const history = (requestParams.history || []).map((m: any) => ({
      role: m.role,
      content: m.content,
    }))

    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
      stream: true,
      stream_options: { include_usage: true },
    })

    // Create stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const sourcesMessage = `__SOURCES__${JSON.stringify(sources)}__END_SOURCES__\n`
          controller.enqueue(new TextEncoder().encode(sourcesMessage))

          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || ""
            if (content) controller.enqueue(new TextEncoder().encode(content))

            // Check for usage in the chunk (usually the last one)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((chunk as any).usage) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const usageMessage = `\n__USAGE__${JSON.stringify((chunk as any).usage)}__END_USAGE__`
              controller.enqueue(new TextEncoder().encode(usageMessage))
            }
          }
          controller.close()
        } catch (e) {
          console.error("Streaming error:", e)
          controller.error(e)
        }
      },
    })

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (err: unknown) {
    console.error("Chat API Error:", err)
    throw error(500, (err as Error).message || "Internal Server Error")
  }
}
