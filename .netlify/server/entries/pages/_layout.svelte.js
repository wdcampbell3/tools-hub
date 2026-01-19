import { S as head, R as pop, P as push, T as store_get, V as unsubscribe_stores } from "../../chunks/index.js";
/* empty css               */
import { n as navigating, p as page } from "../../chunks/stores.js";
import { T as ThemeToggle } from "../../chunks/ThemeToggle.js";
function GoogleAnalytics($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  });
  pop();
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { children } = $$props;
  GoogleAnalytics($$payload);
  $$payload.out += `<!----> `;
  if (store_get($$store_subs ??= {}, "$navigating", navigating)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed w-full top-0 right-0 left-0 h-1 z-50 bg-primary"></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  children?.($$payload);
  $$payload.out += `<!----> `;
  if (!store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/tools")) {
    $$payload.out += "<!--[-->";
    ThemeToggle($$payload, {});
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
