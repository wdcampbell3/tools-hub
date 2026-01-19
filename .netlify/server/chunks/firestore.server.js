import { b as adminDb, i as isFirebaseAdminInitialized } from "./firebase-admin.server.js";
const PROFILES_COLLECTION = "profiles";
const STRIPE_CUSTOMERS_COLLECTION = "stripe_customers";
const CONTACT_REQUESTS_COLLECTION = "contact_requests";
function ensureFirestoreAvailable(operation) {
  if (!isFirebaseAdminInitialized() || !adminDb) {
    console.warn(
      `⚠️ Firestore operation "${operation}" skipped: Firebase Admin SDK not initialized. See _START-HERE.md for setup instructions.`
    );
    return false;
  }
  return true;
}
async function getProfile(userId) {
  if (!ensureFirestoreAvailable("getProfile")) {
    return null;
  }
  const doc = await adminDb.collection(PROFILES_COLLECTION).doc(userId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}
async function createProfile(userId, data) {
  if (!ensureFirestoreAvailable("createProfile")) {
    throw new Error(
      "Cannot create profile: Firebase Admin SDK not initialized. See _START-HERE.md for setup."
    );
  }
  await adminDb.collection(PROFILES_COLLECTION).doc(userId).set({
    ...data,
    id: userId,
    unsubscribed: data.unsubscribed ?? false,
    updated_at: /* @__PURE__ */ new Date()
  });
}
async function updateProfile(userId, data) {
  if (!ensureFirestoreAvailable("updateProfile")) {
    throw new Error(
      "Cannot update profile: Firebase Admin SDK not initialized. See _START-HERE.md for setup."
    );
  }
  await adminDb.collection(PROFILES_COLLECTION).doc(userId).update({
    ...data,
    updated_at: /* @__PURE__ */ new Date()
  });
}
async function deleteProfile(userId) {
  if (!ensureFirestoreAvailable("deleteProfile")) {
    throw new Error(
      "Cannot delete profile: Firebase Admin SDK not initialized. See _START-HERE.md for setup."
    );
  }
  await adminDb.collection(PROFILES_COLLECTION).doc(userId).delete();
}
async function getStripeCustomer(userId) {
  if (!ensureFirestoreAvailable("getStripeCustomer")) {
    return null;
  }
  const doc = await adminDb.collection(STRIPE_CUSTOMERS_COLLECTION).doc(userId).get();
  if (!doc.exists) return null;
  return doc.data();
}
async function createStripeCustomer(userId, stripeCustomerId) {
  if (!ensureFirestoreAvailable("createStripeCustomer")) {
    throw new Error(
      "Cannot create Stripe customer: Firebase Admin SDK not initialized. See _START-HERE.md for setup."
    );
  }
  await adminDb.collection(STRIPE_CUSTOMERS_COLLECTION).doc(userId).set({
    user_id: userId,
    stripe_customer_id: stripeCustomerId,
    updated_at: /* @__PURE__ */ new Date()
  });
}
async function createContactRequest(data) {
  if (!ensureFirestoreAvailable("createContactRequest")) {
    throw new Error(
      "Cannot create contact request: Firebase Admin SDK not initialized. See _START-HERE.md for setup."
    );
  }
  const docRef = await adminDb.collection(CONTACT_REQUESTS_COLLECTION).add({
    ...data,
    updated_at: /* @__PURE__ */ new Date()
  });
  return docRef.id;
}
function decodedTokenToAppUser(decoded) {
  return {
    id: decoded.uid,
    email: decoded.email ?? null,
    emailVerified: decoded.email_verified ?? false
  };
}
export {
  getStripeCustomer as a,
  createProfile as b,
  createStripeCustomer as c,
  deleteProfile as d,
  createContactRequest as e,
  decodedTokenToAppUser as f,
  getProfile as g,
  updateProfile as u
};
