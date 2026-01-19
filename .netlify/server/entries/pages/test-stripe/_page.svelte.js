import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import { R as pop, P as push } from "../../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  let loading = false;
  $$payload.out += `<div class="container mx-auto p-8 max-w-6xl"><h1 class="text-3xl font-bold mb-8">Stripe Connection Test</h1> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Connection Status</h2> <button class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("Test Connection")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Products</h2> <button class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("List Products")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Prices</h2> <button class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("List Prices")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Customers</h2> <button class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("List Customers")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="alert alert-warning"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <div><h3 class="font-bold">LIVE MODE WARNING</h3> <p class="text-sm">You are using a LIVE Stripe API key. Real transactions can be processed.
        For testing, consider using a TEST mode API key (starts with sk_test_ or
        rk_test_).</p></div></div></div>`;
  pop();
}
export {
  _page as default
};
