import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import { R as pop, P as push } from "../../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  let loading = false;
  let testEmail = "";
  let testPassword = "";
  $$payload.out += `<div class="container mx-auto p-8 max-w-4xl"><h1 class="text-3xl font-bold mb-8">Firebase Authentication Test</h1> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Server-side Authentication (Admin SDK)</h2> <button class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("Check Server Auth Status")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Create Test User</h2> <div class="form-control"><label class="label" for="test-email"><span class="label-text">Email (optional - will auto-generate if empty)</span></label> <input id="test-email" type="email" placeholder="test@example.com" class="input input-bordered"${attr("value", testEmail)}></div> <div class="form-control"><label class="label" for="test-password"><span class="label-text">Password (optional - defaults to TestPassword123!)</span></label> <input id="test-password" type="password" placeholder="TestPassword123!" class="input input-bordered"${attr("value", testPassword)}></div> <div class="flex gap-2 mt-4"><button class="btn btn-success"${attr("disabled", loading, true)}>Create Test User</button> <button class="btn btn-error"${attr("disabled", true, true)}>Delete Test User</button></div></div></div> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Client-side Authentication Test</h2> <p class="text-sm text-base-content/70 mb-4">This tests the Firebase client SDK authentication (what users will use)</p> <button class="btn btn-primary"${attr("disabled", true, true)}>${escape_html("Test Client Sign In")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="alert alert-info"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div><h3 class="font-bold">Testing Steps:</h3> <ol class="list-decimal list-inside text-sm mt-2"><li>Click "Check Server Auth Status" to verify admin SDK</li> <li>Click "Create Test User" to create a test account</li> <li>Click "Test Client Sign In" to test client-side authentication</li> <li>Clean up by clicking "Delete Test User" when done</li></ol></div></div></div>`;
  pop();
}
export {
  _page as default
};
