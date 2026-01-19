import { S as head, R as pop, P as push } from "../../../../../chunks/index.js";
import "../../../../../chunks/firebase.js";
import "firebase/auth";
import { a as attr } from "../../../../../chunks/attributes.js";
function _page($$payload, $$props) {
  push();
  let email = "";
  let loading = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Forgot Password</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-6">Forgot Password</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form class="space-y-4"><div class="form-control"><label class="label" for="email"><span class="label-text">Email</span></label> <input id="email" type="email"${attr("value", email)} placeholder="you@example.com" class="input input-bordered w-full" required></div> <button type="submit" class="btn btn-primary w-full"${attr("disabled", loading, true)}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `Send Reset Email`;
  }
  $$payload.out += `<!--]--></button></form> <div class="text-l text-slate-800 mt-4">Remember your password? <a class="underline" href="/login/sign_in">Sign in</a>.</div>`;
  pop();
}
export {
  _page as default
};
