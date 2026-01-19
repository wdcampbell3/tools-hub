import { Y as ensure_array_like, X as stringify, T as store_get, V as unsubscribe_stores, R as pop, P as push } from "../../../chunks/index.js";
import { p as page } from "../../../chunks/stores.js";
import { t as tools } from "../../../chunks/toolsStore.js";
import { T as ThemeToggle } from "../../../chunks/ThemeToggle.js";
import { a as attr } from "../../../chunks/attributes.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { children } = $$props;
  const each_array = ensure_array_like(tools);
  $$payload.out += `<div class="drawer lg:drawer-open"><input id="tools-drawer" type="checkbox" class="drawer-toggle"> <div class="drawer-content flex flex-col h-[100dvh] bg-base-100 overflow-hidden"><div class="w-full navbar bg-base-100 lg:hidden border-b border-base-200 flex-none z-10"><div class="flex-none"><label for="tools-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></label></div> <div class="flex-1 px-2 mx-2 font-bold text-lg">Tools Hub</div></div> <main class="flex-1 flex flex-col relative overflow-hidden">`;
  children?.($$payload);
  $$payload.out += `<!----></main></div> <div class="drawer-side z-20"><label for="tools-drawer" aria-label="close sidebar" class="drawer-overlay"></label> <div class="p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col gap-2"><div class="mb-4 flex items-center justify-between px-2"><a href="/" class="flex-1 px-2 py-2 text-xl font-bold text-base-content hover:bg-base-300 rounded-lg">🏠 Tools Hub</a> <div class="ml-2">`;
  ThemeToggle($$payload, { inline: true });
  $$payload.out += `<!----></div></div> <ul class="menu p-0 gap-2"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tool = each_array[$$index];
    $$payload.out += `<li><a${attr("href", `/tools/${stringify(tool.id)}`)}${attr("class", store_get($$store_subs ??= {}, "$page", page).url.pathname.includes(tool.id) ? "bg-primary !text-white font-bold shadow-md" : "hover:bg-base-300 text-base-content")}><span class="text-2xl">${escape_html(tool.icon)}</span> <span class="font-medium">${escape_html(tool.name)}</span></a></li>`;
  }
  $$payload.out += `<!--]--></ul></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
