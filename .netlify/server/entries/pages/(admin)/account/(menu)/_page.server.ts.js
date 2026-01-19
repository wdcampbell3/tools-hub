import { r as redirect } from "../../../../../chunks/index2.js";
const actions = {
  signout: async ({ locals }) => {
    const { user } = await locals.getSession();
    if (user) {
      locals.clearSessionCookie();
    }
    redirect(303, "/");
  }
};
export {
  actions
};
