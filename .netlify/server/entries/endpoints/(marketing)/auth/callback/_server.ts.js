import { r as redirect } from "../../../../../chunks/index2.js";
const GET = async ({ url }) => {
  const next = url.searchParams.get("next");
  if (next) {
    redirect(303, next);
  }
  redirect(303, "/account");
};
export {
  GET
};
