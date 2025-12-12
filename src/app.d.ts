import type { DecodedIdToken } from "firebase-admin/auth"
import type { AppUser } from "$lib/firestore.server"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      getSession: () => Promise<{
        user: AppUser | null
        decodedToken: DecodedIdToken | null
      }>
      setSessionCookie: (idToken: string) => Promise<void>
      clearSessionCookie: () => void
      user: AppUser | null
      decodedToken: DecodedIdToken | null
    }
    interface PageData {
      user: AppUser | null
    }
    // interface Error {}
    // interface Platform {}
  }
}

export {}
