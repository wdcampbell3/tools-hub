import { S as head } from "../../../../../chunks/index.js";
import { P as Pricing_module } from "../../../../../chunks/pricing_module.js";
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Select a Plan</title>`;
  });
  $$payload.out += `<div class="text-center content-center min-h-[100vh] pb-12 mt-4 flex items-center place-content-center"><div class="flex flex-col w-full px-6"><div><h1 class="text-2xl font-bold mb-2">Select a Plan</h1> <div class="mb-6">View our <a href="/pricing" target="_blank" class="link">pricing page</a> for details.</div> `;
  Pricing_module($$payload, { callToAction: "Select Plan" });
  $$payload.out += `<!----></div></div></div>`;
}
export {
  _page as default
};
