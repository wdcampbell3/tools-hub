// Session endpoint for creating Firebase session cookies
import { json, type RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return json({ error: "No ID token provided" }, { status: 400 })
    }

    await locals.setSessionCookie(idToken)

    return json({ success: true })
  } catch (error) {
    console.error("Session creation error:", error)
    return json({ error: "Failed to create session" }, { status: 500 })
  }
}

export const DELETE: RequestHandler = async ({ locals }) => {
  locals.clearSessionCookie()
  return json({ success: true })
}
