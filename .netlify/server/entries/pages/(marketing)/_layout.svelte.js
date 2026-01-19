import { R as pop, P as push } from "../../../chunks/index.js";
/* empty css                  */
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  $$payload.out += `<div>`;
  children?.($$payload);
  $$payload.out += `<!----></div>`;
  pop();
}
export {
  _layout as default
};
