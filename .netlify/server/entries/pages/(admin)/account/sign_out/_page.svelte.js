import { e as escape_html } from "../../../../../chunks/escaping.js";
import { R as pop, P as push } from "../../../../../chunks/index.js";
import "../../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let message = "Signing out....";
  $$payload.out += `<h1 class="text-2xl font-bold m-6 mx-auto my-auto">${escape_html(message)}</h1>`;
  pop();
}
export {
  _page as default
};
