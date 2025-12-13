import { adminAuth } from "$lib/firebase-admin.server"
import { decodedTokenToAppUser, type AppUser } from "$lib/firestore.server"
// import { redirect } from "@sveltejs/kit" // Removed unused import
import type { Handle } from "@sveltejs/kit"
import { sequence } from "@sveltejs/kit/hooks"
import type { DecodedIdToken } from "firebase-admin/auth"

const SESSION_COOKIE_NAME = "__session"

export const firebase: Handle = async ({ event, resolve }) => {
  // Get session cookie
  const sessionCookie = event.cookies.get(SESSION_COOKIE_NAME)

  event.locals.getSession = async (): Promise<{
    user: AppUser | null
    decodedToken: DecodedIdToken | null
  }> => {
    if (!sessionCookie) {
      return { user: null, decodedToken: null }
    }

    try {
      // Verify the session cookie
      const decodedToken = await adminAuth.verifySessionCookie(
        sessionCookie,
        true,
      )
      const user = decodedTokenToAppUser(decodedToken)
      return { user, decodedToken }
    } catch {
      // Invalid or expired session
      return { user: null, decodedToken: null }
    }
  }

  // Helper to set session cookie
  event.locals.setSessionCookie = async (idToken: string) => {
    // Create session cookie that expires in 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    })

    event.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: expiresIn / 1000, // maxAge is in seconds
    })
  }

  // Helper to clear session cookie
  event.locals.clearSessionCookie = () => {
    event.cookies.delete(SESSION_COOKIE_NAME, { path: "/" })
  }

  return resolve(event)
}

// Auth guard to populate user in locals
const authGuard: Handle = async ({ event, resolve }) => {
  const { user, decodedToken } = await event.locals.getSession()
  event.locals.user = user
  event.locals.decodedToken = decodedToken

  return resolve(event)
}

export const handle: Handle = sequence(firebase, authGuard)
