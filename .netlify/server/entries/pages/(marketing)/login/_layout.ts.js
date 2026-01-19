import { r as redirect } from "../../../../chunks/index2.js";
const load = async ({ url, data }) => {
  if (data.user) {
    redirect(303, "/account");
  }
  return {
    url: url.pathname,
    user: data.user
  };
};
export {
  load
};
