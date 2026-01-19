import { i as isFirebaseAdminInitialized, a as adminAuth } from "./firebase-admin.server.js";
import { f as decodedTokenToAppUser } from "./firestore.server.js";
function sequence(...handlers) {
  const length = handlers.length;
  if (!length) return ({ event, resolve }) => resolve(event);
  return ({ event, resolve }) => {
    return apply_handle(0, event, {});
    function apply_handle(i, event2, parent_options) {
      const handle2 = handlers[i];
      return handle2({
        event: event2,
        resolve: (event3, options) => {
          const transformPageChunk = async ({ html, done }) => {
            if (options?.transformPageChunk) {
              html = await options.transformPageChunk({ html, done }) ?? "";
            }
            if (parent_options?.transformPageChunk) {
              html = await parent_options.transformPageChunk({ html, done }) ?? "";
            }
            return html;
          };
          const filterSerializedResponseHeaders = parent_options?.filterSerializedResponseHeaders ?? options?.filterSerializedResponseHeaders;
          const preload = parent_options?.preload ?? options?.preload;
          return i < length - 1 ? apply_handle(i + 1, event3, {
            transformPageChunk,
            filterSerializedResponseHeaders,
            preload
          }) : resolve(event3, { transformPageChunk, filterSerializedResponseHeaders, preload });
        }
      });
    }
  };
}
const SESSION_COOKIE_NAME = "__session";
const firebase = async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get(SESSION_COOKIE_NAME);
  event.locals.getSession = async () => {
    if (!isFirebaseAdminInitialized() || !adminAuth) {
      return { user: null, decodedToken: null };
    }
    if (!sessionCookie) {
      return { user: null, decodedToken: null };
    }
    try {
      const decodedToken = await adminAuth.verifySessionCookie(
        sessionCookie,
        true
      );
      const user = decodedTokenToAppUser(decodedToken);
      return { user, decodedToken };
    } catch {
      return { user: null, decodedToken: null };
    }
  };
  event.locals.setSessionCookie = async (idToken) => {
    if (!isFirebaseAdminInitialized() || !adminAuth) {
      console.warn(
        "⚠️ Cannot create session cookie: Firebase Admin SDK not initialized"
      );
      return;
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1e3;
    const sessionCookie2 = await adminAuth.createSessionCookie(idToken, {
      expiresIn
    });
    event.cookies.set(SESSION_COOKIE_NAME, sessionCookie2, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: expiresIn / 1e3
      // maxAge is in seconds
    });
  };
  event.locals.clearSessionCookie = () => {
    event.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
  };
  return resolve(event);
};
const authGuard = async ({ event, resolve }) => {
  const { user, decodedToken } = await event.locals.getSession();
  event.locals.user = user;
  event.locals.decodedToken = decodedToken;
  return resolve(event);
};
const handle = sequence(firebase, authGuard);
export {
  firebase,
  handle
};
