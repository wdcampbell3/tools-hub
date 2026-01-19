import { r as redirect } from "../../../../chunks/index2.js";
import { C as CreateProfileStep } from "../../../../chunks/config.js";
const load = async ({ data, url }) => {
  const { user, profile } = data;
  if (!user) {
    redirect(303, "/login");
  }
  const createProfilePath = "/account/create_profile";
  const signOutPath = "/account/sign_out";
  if (profile && !_hasFullProfile(profile) && url.pathname !== createProfilePath && url.pathname !== signOutPath && CreateProfileStep) {
    redirect(303, createProfilePath);
  }
  return {
    user,
    profile
  };
};
const _hasFullProfile = (profile) => {
  if (!profile) {
    return false;
  }
  if (!profile.full_name) {
    return false;
  }
  if (!profile.company_name) {
    return false;
  }
  if (!profile.website) {
    return false;
  }
  return true;
};
export {
  _hasFullProfile,
  load
};
