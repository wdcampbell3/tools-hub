import { redirect } from "@sveltejs/kit"

export const actions = {
  signout: async ({ locals }) => {
    const { user } = await locals.getSession()
    if (user) {
      locals.clearSessionCookie()
    }
    redirect(303, "/")
  },
}
