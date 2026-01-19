const load = async ({
  locals: { user },
  cookies,
  url
}) => {
  return {
    url: url.origin,
    cookies: cookies.getAll(),
    user
  };
};
export {
  load
};
