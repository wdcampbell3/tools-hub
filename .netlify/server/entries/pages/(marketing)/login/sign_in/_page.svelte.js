import { S as head, T as store_get, V as unsubscribe_stores, R as pop, P as push } from "../../../../../chunks/index.js";
import "../../../../../chunks/firebase.js";
import "firebase/auth";
import "../../../../../chunks/client.js";
import { p as page } from "../../../../../chunks/stores.js";
import { a as attr } from "../../../../../chunks/attributes.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let email = "";
  let password = "";
  let loading = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Sign in</title>`;
  });
  if (store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("verified") == "true") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div role="alert" class="alert alert-success mb-5"><svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>Email verified! Please sign in.</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <h1 class="text-2xl font-bold mb-6">Sign In</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form class="space-y-4"><div class="form-control"><label class="label" for="email"><span class="label-text">Email</span></label> <input id="email" type="email"${attr("value", email)} placeholder="you@example.com" class="input input-bordered w-full" required></div> <div class="form-control"><label class="label" for="password"><span class="label-text">Password</span></label> <input id="password" type="password"${attr("value", password)} placeholder="Your password" class="input input-bordered w-full" required></div> <button type="submit" class="btn btn-primary w-full"${attr("disabled", loading, true)}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `Sign In`;
  }
  $$payload.out += `<!--]--></button></form> <div class="divider">OR</div> <button class="btn btn-outline w-full"${attr("disabled", loading, true)}><svg class="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> Continue with Google</button> <div class="text-base text-base-content mt-4"><a class="underline hover:text-primary transition-colors" href="/login/forgot_password">Forgot password?</a></div> <div class="text-base text-base-content mt-3">Don't have an account? <a class="underline hover:text-primary transition-colors" href="/login/sign_up">Sign up</a>.</div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
