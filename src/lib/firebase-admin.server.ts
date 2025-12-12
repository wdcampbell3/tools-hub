import { env } from "$env/dynamic/private"
import { building } from "$app/environment"
import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let adminApp: App
let adminAuth: Auth
let adminDb: Firestore

// Initialize Firebase Admin (only once)
if (!building) {
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId: env.PRIVATE_FIREBASE_PROJECT_ID,
        clientEmail: env.PRIVATE_FIREBASE_CLIENT_EMAIL,
        // Private key comes with escaped newlines, need to replace them
        privateKey: env.PRIVATE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  } else {
    adminApp = getApps()[0]
  }
  adminAuth = getAuth(adminApp)
  adminDb = getFirestore(adminApp)
}

export { adminApp, adminAuth, adminDb }
