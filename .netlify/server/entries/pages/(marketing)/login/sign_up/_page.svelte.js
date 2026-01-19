import { S as head, R as pop, P as push } from "../../../../../chunks/index.js";
import "../../../../../chunks/firebase.js";
import "firebase/auth";
import "../../../../../chunks/client.js";
import { a as attr } from "../../../../../chunks/attributes.js";
function _page($$payload, $$props) {
  push();
  let email = "";
  let password = "";
  let confirmPassword = "";
  let loading = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Sign up</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-6">Sign Up</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form class="space-y-4"><div class="form-control"><label class="label" for="email"><span class="label-text">Email</span></label> <input id="email" type="email"${attr("value", email)} placeholder="you@example.com" class="input input-bordered w-full" required></div> <div class="form-control"><label class="label" for="password"><span class="label-text">Password</span></label> <input id="password" type="password"${attr("value", password)} placeholder="Choose a password" class="input input-bordered w-full" required minlength="6"></div> <div class="form-control"><label class="label" for="confirmPassword"><span class="label-text">Confirm Password</span></label> <input id="confirmPassword" type="password"${attr("value", confirmPassword)} placeholder="Confirm your password" class="input input-bordered w-full" required></div> <button type="submit" class="btn btn-primary w-full"${attr("disabled", loading, true)}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `Sign Up`;
  }
  $$payload.out += `<!--]--></button></form> <div class="divider">OR</div> <button class="btn btn-outline w-full"${attr("disabled", loading, true)}><svg class="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> Continue with Google</button> <div class="text-l text-slate-800 mt-4 mb-2">Have an account? <a class="underline" href="/login/sign_in">Sign in</a>.</div>`;
  pop();
}
export {
  _page as default
};
