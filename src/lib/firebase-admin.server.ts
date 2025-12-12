// Server-side Firebase Admin SDK
import { initializeApp, getApps, cert, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"
import {
  PRIVATE_FIREBASE_PROJECT_ID,
  PRIVATE_FIREBASE_CLIENT_EMAIL,
  PRIVATE_FIREBASE_PRIVATE_KEY,
} from "$env/static/private"

let adminApp: App
let adminAuth: Auth
let adminDb: Firestore

// Initialize Firebase Admin (only once)
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: PRIVATE_FIREBASE_PROJECT_ID,
      clientEmail: PRIVATE_FIREBASE_CLIENT_EMAIL,
      // Private key comes with escaped newlines, need to replace them
      privateKey: PRIVATE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
} else {
  adminApp = getApps()[0]
}

adminAuth = getAuth(adminApp)
adminDb = getFirestore(adminApp)

export { adminApp, adminAuth, adminDb }
