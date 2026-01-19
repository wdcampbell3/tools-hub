import { j as json } from "../../../../../chunks/index2.js";
const POST = async ({ request, locals }) => {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return json({ error: "No ID token provided" }, { status: 400 });
    }
    await locals.setSessionCookie(idToken);
    return json({ success: true });
  } catch (error) {
    console.error("Session creation error:", error);
    return json({ error: "Failed to create session" }, { status: 500 });
  }
};
const DELETE = async ({ locals }) => {
  locals.clearSessionCookie();
  return json({ success: true });
};
export {
  DELETE,
  POST
};
