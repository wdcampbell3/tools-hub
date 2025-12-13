import { redirect } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ url, data }) => {
  // Redirect if already logged in
  if (data.user) {
    redirect(303, "/account")
  }

  return {
    url: url.pathname,
    user: data.user,
  }
}
