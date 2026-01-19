import { g as getProfile } from "../../../../chunks/firestore.server.js";
const prerender = false;
const load = async ({ locals: { user } }) => {
  let profile = null;
  if (user) {
    profile = await getProfile(user.id);
  }
  return {
    user,
    profile
  };
};
export {
  load,
  prerender
};
