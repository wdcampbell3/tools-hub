import type { LayoutServerLoad } from "./$types"
import { getProfile } from "$lib/firestore.server"

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
  // User here is from authGuard hook in hooks.server.ts
  let profile = null

  if (user) {
    profile = await getProfile(user.id)
  }

  return {
    user,
    profile,
  }
}
