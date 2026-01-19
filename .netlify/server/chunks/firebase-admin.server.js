import { d as private_env } from "./shared-server.js";
import { b as building } from "./environment.js";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
let adminApp;
let adminAuth;
let adminDb;
let firebaseInitialized = false;
let initializationError = null;
const isTestEnv = typeof process !== "undefined" && process.env.VITEST;
if (!building && !isTestEnv) {
  try {
    const projectId = private_env.PRIVATE_FIREBASE_PROJECT_ID;
    const clientEmail = private_env.PRIVATE_FIREBASE_CLIENT_EMAIL;
    const privateKey = private_env.PRIVATE_FIREBASE_PRIVATE_KEY;
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing required Firebase credentials. Please check your .env.local file."
      );
    }
    if (projectId.includes("your-") || clientEmail.includes("your-") || privateKey.includes("your-")) {
      throw new Error(
        "Firebase credentials appear to be placeholder values. Please update .env.local with real credentials."
      );
    }
    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          // Private key comes with escaped newlines, need to replace them
          privateKey: privateKey.replace(/\\n/g, "\n")
        })
      });
    } else {
      adminApp = getApps()[0];
    }
    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    firebaseInitialized = true;
  } catch (error) {
    initializationError = error instanceof Error ? error.message : "Unknown error";
    console.warn("\n" + "=".repeat(70));
    console.warn("⚠️  FIREBASE ADMIN SDK INITIALIZATION FAILED");
    console.warn("=".repeat(70));
    console.warn(`Error: ${initializationError}`);
    console.warn("");
    console.warn("📖 This is expected if you haven't configured Firebase yet.");
    console.warn("   Pages that don't require auth/database will still work!");
    console.warn("");
    console.warn("🔧 To fix this:");
    console.warn(
      "   1. Follow the Firebase setup in _START-HERE.md (see 'Set up Firebase' section)"
    );
    console.warn("   2. Ensure .env.local has valid PRIVATE_FIREBASE_* values");
    console.warn("   3. Restart the dev server after updating .env.local");
    console.warn("=".repeat(70) + "\n");
  }
}
function isFirebaseAdminInitialized() {
  return firebaseInitialized;
}
function getFirebaseInitError() {
  return initializationError;
}
export {
  adminAuth as a,
  adminDb as b,
  getFirebaseInitError as g,
  isFirebaseAdminInitialized as i
};
