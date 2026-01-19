import { T as store_get, V as unsubscribe_stores, R as pop, P as push } from "../../chunks/index.js";
/* empty css               */
import { p as page } from "../../chunks/stores.js";
import { e as escape_html } from "../../chunks/escaping.js";
function _error($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<div class="hero min-h-[100vh]"><div class="hero-content text-center"><div class="max-w-lg"><h1 class="text-5xl font-bold">This is embarrassing...</h1> <p class="py-6 text-2xl">There was an error: ${escape_html(store_get($$store_subs ??= {}, "$page", page)?.error?.message)}</p> <div><a href="/" class="btn btn-primary btn-wide">Return Home</a></div></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _error as default
};
