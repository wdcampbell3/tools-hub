// src/routes/auth/callback/+server.ts
// This callback handles OAuth provider redirects (e.g., Google)
// Firebase handles most OAuth internally via popup, but this remains for fallback
import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async ({ url }) => {
  // If there's a next parameter, redirect there
  const next = url.searchParams.get("next")
  if (next) {
    redirect(303, next)
  }

  // Default redirect to account
  redirect(303, "/account")
}
