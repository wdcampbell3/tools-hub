import { R as pop, P as push, X as stringify } from "../../../../chunks/index.js";
import { a as attr } from "../../../../chunks/attributes.js";
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  let isEurope = false;
  try {
    isEurope = Intl.DateTimeFormat().resolvedOptions().timeZone.startsWith("Europe/");
  } catch (e) {
  }
  $$payload.out += `<div class="text-center content-center max-w-lg mx-auto min-h-[70vh] pb-12 flex items-center place-content-center"><div class="flex flex-col w-64 lg:w-80">`;
  children?.($$payload);
  $$payload.out += `<!----> <div${attr("class", `mt-8 ${stringify(isEurope ? "block" : "hidden")}`)}>🍪 Logging in uses Cookies 🍪</div></div></div>`;
  pop();
}
export {
  _layout as default
};
