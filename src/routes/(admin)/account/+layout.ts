import { redirect } from "@sveltejs/kit"
import { CreateProfileStep } from "../../../config"
import type { Profile } from "$lib/firestore.server"

export const load = async ({ data, url }) => {
  const { user, profile } = data

  if (!user) {
    redirect(303, "/login")
  }

  const createProfilePath = "/account/create_profile"
  const signOutPath = "/account/sign_out"
  if (
    profile &&
    !_hasFullProfile(profile) &&
    url.pathname !== createProfilePath &&
    url.pathname !== signOutPath &&
    CreateProfileStep
  ) {
    redirect(303, createProfilePath)
  }

  return {
    user,
    profile,
  }
}

export const _hasFullProfile = (profile: Profile | null) => {
  if (!profile) {
    return false
  }
  if (!profile.full_name) {
    return false
  }
  if (!profile.company_name) {
    return false
  }
  if (!profile.website) {
    return false
  }

  return true
}
