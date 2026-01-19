import { T as store_get, Y as ensure_array_like, S as head, V as unsubscribe_stores, R as pop, P as push, X as stringify } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/stores.js";
import "../../../../chunks/client.js";
import { a as attr } from "../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let results = [];
  let searchQuery = decodeURIComponent(store_get($$store_subs ??= {}, "$page", page).url.hash.slice(1) ?? "");
  const each_array = ensure_array_like(results);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Search</title>`;
    $$payload2.out += `<meta name="description" content="Search our website.">`;
  });
  $$payload.out += `<div class="py-8 lg:py-12 px-6 max-w-lg mx-auto"><div class="text-3xl lg:text-5xl font-medium text-primary flex gap-3 items-baseline text-center place-content-center"><div class="text-center leading-relaxed font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">Search</div></div> <label class="input input-bordered flex items-center gap-2 mt-10 mb-5 w-full"><input id="search-input" type="text" class="grow w-full" placeholder="Search"${attr("value", searchQuery)} aria-label="Search input"></label> `;
  if (searchQuery.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center mt-10 text-accent text-xl">Loading...</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let result = each_array[i];
    $$payload.out += `<a${attr("href", result.item.path || "/")}${attr("id", `search-result-${stringify(i + 1)}`)} class="card my-6 bg-white shadow-xl flex-row overflow-hidden focus:mx-[-10px] focus:my-[-5px] focus:border-4 focus:border-secondary"><div class="flex-none w-6 md:w-32 bg-secondary"></div> <div class="py-6 px-6"><div class="text-xl">${escape_html(result.item.title)}</div> <div class="text-sm text-accent">${escape_html(result.item.path)}</div> <div class="text-slate-500">${escape_html(result.item.description)}</div></div></a>`;
  }
  $$payload.out += `<!--]--></div> <div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
