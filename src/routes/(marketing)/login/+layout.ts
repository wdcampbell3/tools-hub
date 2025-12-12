import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ parent, url }) => {
  // Get user from parent layout
  const parentData = await parent()

  // Redirect if already logged in
  if (parentData.user) {
    redirect(303, "/account")
  }

  return { url: url.origin }
}
