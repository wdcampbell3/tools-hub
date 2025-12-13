import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  locals: { user },
  cookies,
  url,
}) => {
  return {
    url: url.origin,
    cookies: cookies.getAll(),
    user,
  }
}
