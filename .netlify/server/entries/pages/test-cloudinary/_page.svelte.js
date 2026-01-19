import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import { R as pop, P as push } from "../../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  let loading = false;
  $$payload.out += `<div class="container mx-auto p-8 max-w-4xl"><h1 class="text-3xl font-bold mb-8">Cloudinary Connection Test</h1> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Connection Status</h2> <button class="btn btn-primary"${attr("disabled", loading, true)}>${escape_html("Test Connection")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Test Upload (1x1 Test Image)</h2> <p class="text-sm text-base-content/70">This will upload a tiny test image and immediately delete it</p> <button class="btn btn-success"${attr("disabled", loading, true)}>${escape_html("Test Upload & Delete")}</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="card bg-base-200 shadow-xl mb-6"><div class="card-body"><h2 class="card-title">Upload Custom Image</h2> <div class="form-control"><label class="label" for="file-upload"><span class="label-text">Select an image file</span></label> <input id="file-upload" type="file" accept="image/*" class="file-input file-input-bordered"></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button class="btn btn-primary mt-4"${attr("disabled", true, true)}>${escape_html("Upload to Cloudinary")}</button></div></div> <div class="alert alert-info"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div><h3 class="font-bold">Cloudinary Test Summary</h3> <ul class="list-disc list-inside text-sm mt-2"><li>Connection test verifies API credentials and lists existing resources</li> <li>Upload test creates and deletes a tiny test image</li> <li>Custom upload lets you test with your own images</li></ul></div></div></div>`;
  pop();
}
export {
  _page as default
};
