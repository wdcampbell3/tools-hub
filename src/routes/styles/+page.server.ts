import { dev } from "$app/environment"
import { error } from "@sveltejs/kit"

export function load() {
  // Only allow access in development mode
  if (!dev) {
    throw error(404, "Not found")
  }

  return {}
}
