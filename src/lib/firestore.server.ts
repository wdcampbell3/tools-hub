// Firestore service helpers
import { adminDb, isFirebaseAdminInitialized } from "./firebase-admin.server"
import type { DecodedIdToken } from "firebase-admin/auth"

// Collection names
const PROFILES_COLLECTION = "profiles"
const STRIPE_CUSTOMERS_COLLECTION = "stripe_customers"
const CONTACT_REQUESTS_COLLECTION = "contact_requests"

// Profile types
export interface Profile {
  id: string
  full_name: string | null
  company_name: string | null
  avatar_url: string | null
  website: string | null
  unsubscribed: boolean
  updated_at: Date | null
}

// Stripe customer types
export interface StripeCustomer {
  user_id: string
  stripe_customer_id: string
  updated_at: Date | null
}

// Contact request types
export interface ContactRequest {
  id?: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  company_name: string | null
  message_body: string | null
  updated_at: Date | null
}

/**
 * Helper to check if Firestore is available.
 * Logs a warning if not initialized.
 */
function ensureFirestoreAvailable(operation: string): boolean {
  if (!isFirebaseAdminInitialized() || !adminDb) {
    console.warn(
      `⚠️ Firestore operation "${operation}" skipped: Firebase Admin SDK not initialized. ` +
        `See _START-HERE.md for setup instructions.`,
    )
    return false
  }
  return true
}

// Profile operations
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!ensureFirestoreAvailable("getProfile")) {
    return null
  }
  const doc = await adminDb!.collection(PROFILES_COLLECTION).doc(userId).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() } as Profile
}

export async function createProfile(
  userId: string,
  data: Partial<Profile>,
): Promise<void> {
  if (!ensureFirestoreAvailable("createProfile")) {
    throw new Error(
      "Cannot create profile: Firebase Admin SDK not initialized. See _START-HERE.md for setup.",
    )
  }
  await adminDb!
    .collection(PROFILES_COLLECTION)
    .doc(userId)
    .set({
      ...data,
      id: userId,
      unsubscribed: data.unsubscribed ?? false,
      updated_at: new Date(),
    })
}

export async function updateProfile(
  userId: string,
  data: Partial<Profile>,
): Promise<void> {
  if (!ensureFirestoreAvailable("updateProfile")) {
    throw new Error(
      "Cannot update profile: Firebase Admin SDK not initialized. See _START-HERE.md for setup.",
    )
  }
  await adminDb!
    .collection(PROFILES_COLLECTION)
    .doc(userId)
    .update({
      ...data,
      updated_at: new Date(),
    })
}

export async function deleteProfile(userId: string): Promise<void> {
  if (!ensureFirestoreAvailable("deleteProfile")) {
    throw new Error(
      "Cannot delete profile: Firebase Admin SDK not initialized. See _START-HERE.md for setup.",
    )
  }
  await adminDb!.collection(PROFILES_COLLECTION).doc(userId).delete()
}

// Stripe customer operations
export async function getStripeCustomer(
  userId: string,
): Promise<StripeCustomer | null> {
  if (!ensureFirestoreAvailable("getStripeCustomer")) {
    return null
  }
  const doc = await adminDb!
    .collection(STRIPE_CUSTOMERS_COLLECTION)
    .doc(userId)
    .get()
  if (!doc.exists) return null
  return doc.data() as StripeCustomer
}

export async function createStripeCustomer(
  userId: string,
  stripeCustomerId: string,
): Promise<void> {
  if (!ensureFirestoreAvailable("createStripeCustomer")) {
    throw new Error(
      "Cannot create Stripe customer: Firebase Admin SDK not initialized. See _START-HERE.md for setup.",
    )
  }
  await adminDb!.collection(STRIPE_CUSTOMERS_COLLECTION).doc(userId).set({
    user_id: userId,
    stripe_customer_id: stripeCustomerId,
    updated_at: new Date(),
  })
}

// Contact request operations
export async function createContactRequest(
  data: ContactRequest,
): Promise<string> {
  if (!ensureFirestoreAvailable("createContactRequest")) {
    throw new Error(
      "Cannot create contact request: Firebase Admin SDK not initialized. See _START-HERE.md for setup.",
    )
  }
  const docRef = await adminDb!.collection(CONTACT_REQUESTS_COLLECTION).add({
    ...data,
    updated_at: new Date(),
  })
  return docRef.id
}

// Helper to convert Firebase user to app user
export interface AppUser {
  id: string
  email: string | null
  emailVerified: boolean
}

export function decodedTokenToAppUser(decoded: DecodedIdToken): AppUser {
  return {
    id: decoded.uid,
    email: decoded.email ?? null,
    emailVerified: decoded.email_verified ?? false,
  }
}
