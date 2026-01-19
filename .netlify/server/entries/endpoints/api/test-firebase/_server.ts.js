import { j as json } from "../../../../chunks/index2.js";
import { b as adminDb, a as adminAuth, i as isFirebaseAdminInitialized, g as getFirebaseInitError } from "../../../../chunks/firebase-admin.server.js";
const GET = async () => {
  const initialized = isFirebaseAdminInitialized();
  const error = getFirebaseInitError();
  if (!initialized) {
    return json(
      {
        success: false,
        initialized: false,
        error: error || "Firebase Admin SDK is not initialized",
        message: "Firebase Admin SDK failed to initialize. Check server logs for details."
      },
      { status: 500 }
    );
  }
  const results = {
    success: true,
    initialized: true,
    message: "Firebase Admin SDK is initialized!",
    tests: {}
  };
  try {
    const testDoc = adminDb.collection("_connection_test").doc("test");
    await testDoc.set({ timestamp: (/* @__PURE__ */ new Date()).toISOString(), test: true });
    await testDoc.delete();
    results.tests.firestore = {
      status: "passed",
      message: "Firestore read/write successful"
    };
  } catch (firestoreError) {
    results.tests.firestore = {
      status: "failed",
      error: firestoreError instanceof Error ? firestoreError.message : "Unknown error"
    };
  }
  try {
    const listUsersResult = await adminAuth.listUsers(1);
    results.tests.auth = {
      status: "passed",
      message: "Auth is configured",
      userCount: listUsersResult.users.length
    };
  } catch (authError) {
    results.tests.auth = {
      status: "not_configured",
      error: authError instanceof Error ? authError.message : "Unknown error",
      message: "Auth may not be enabled in Firebase Console yet"
    };
  }
  results.success = results.tests.firestore.status === "passed";
  return json(results, { status: results.success ? 200 : 500 });
};
export {
  GET
};
