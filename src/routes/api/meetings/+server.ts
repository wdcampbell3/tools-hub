import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { getIndex } from "$lib/server/pinecone-client"

export const GET: RequestHandler = async () => {
  try {
    const index = getIndex()

    // Get index stats to find all unique meetings

    // Query to get a sample of records to extract unique meetings
    // We'll use a dummy vector and high topK to get many records
    const dummyVector = new Array(1024).fill(0)

    const queryResponse = await index.namespace("meeting-transcripts").query({
      vector: dummyVector,
      topK: 1000,
      includeMetadata: true,
    })

    // Extract unique meetings
    const meetingsMap = new Map<
      string,
      { message_id: string; meeting_name: string; meeting_date: string }
    >()

    queryResponse.matches.forEach((match) => {
      const metadata = match.metadata || {}
      const messageId = metadata.message_id as string

      if (messageId && !meetingsMap.has(messageId)) {
        meetingsMap.set(messageId, {
          message_id: messageId,
          meeting_name: (metadata.meeting_name as string) || "Unknown meeting",
          meeting_date: (metadata.meeting_date as string) || "Unknown date",
        })
      }
    })

    // Convert to array and sort by date (most recent first)
    const meetings = Array.from(meetingsMap.values()).sort((a, b) => {
      const dateA = new Date(a.meeting_date)
      const dateB = new Date(b.meeting_date)
      return dateB.getTime() - dateA.getTime()
    })

    return json({ meetings })
  } catch (error) {
    console.error("Error fetching meetings:", error)
    return json({ meetings: [] })
  }
}
