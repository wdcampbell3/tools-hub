import { env } from "$env/dynamic/private"
import { building } from "$app/environment"
import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let adminApp: App | undefined
let adminAuth: Auth | undefined
let adminDb: Firestore | undefined

// Track initialization status for helpful error messages
let firebaseInitialized = false
let initializationError: string | null = null

// Skip initialization during build or tests
const isTestEnv = typeof process !== "undefined" && process.env.VITEST

if (!building && !isTestEnv) {
  try {
    // Validate required environment variables before attempting initialization
    const projectId = env.PRIVATE_FIREBASE_PROJECT_ID
    const clientEmail = env.PRIVATE_FIREBASE_CLIENT_EMAIL
    const privateKey = env.PRIVATE_FIREBASE_PRIVATE_KEY

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing required Firebase credentials. Please check your .env.local file.",
      )
    }

    // Check for placeholder values (common in .env.example)
    if (
      projectId.includes("your-") ||
      clientEmail.includes("your-") ||
      privateKey.includes("your-")
    ) {
      throw new Error(
        "Firebase credentials appear to be placeholder values. Please update .env.local with real credentials.",
      )
    }

    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          // Private key comes with escaped newlines, need to replace them
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      })
    } else {
      adminApp = getApps()[0]
    }
    adminAuth = getAuth(adminApp)
    adminDb = getFirestore(adminApp)
    firebaseInitialized = true
  } catch (error) {
    // Capture the error message for logging
    initializationError =
      error instanceof Error ? error.message : "Unknown error"

    // Log a helpful warning instead of crashing
    console.warn("\n" + "=".repeat(70))
    console.warn("⚠️  FIREBASE ADMIN SDK INITIALIZATION FAILED")
    console.warn("=".repeat(70))
    console.warn(`Error: ${initializationError}`)
    console.warn("")
    console.warn("📖 This is expected if you haven't configured Firebase yet.")
    console.warn("   Pages that don't require auth/database will still work!")
    console.warn("")
    console.warn("🔧 To fix this:")
    console.warn("   1. Follow the Firebase setup in _START-HERE.md (see 'Set up Firebase' section)")
    console.warn("   2. Ensure .env.local has valid PRIVATE_FIREBASE_* values")
    console.warn("   3. Restart the dev server after updating .env.local")
    console.warn("=".repeat(70) + "\n")

    // Leave adminApp, adminAuth, adminDb as undefined
  }
}

/**
 * Check if Firebase Admin SDK is properly initialized.
 * Use this to conditionally enable Firebase-dependent features.
 */
export function isFirebaseAdminInitialized(): boolean {
  return firebaseInitialized
}

/**
 * Get the initialization error message, if any.
 * Useful for debugging or displaying to developers.
 */
export function getFirebaseInitError(): string | null {
  return initializationError
}

export { adminApp, adminAuth, adminDb }
