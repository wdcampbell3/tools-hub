import { Y as ensure_array_like, S as head, R as pop, P as push } from "../../../../chunks/index.js";
import { s as sortedBlogPosts, b as blogInfo } from "../../../../chunks/posts.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
import { a as attr } from "../../../../chunks/attributes.js";
function _page($$payload, $$props) {
  push();
  const each_array = ensure_array_like(sortedBlogPosts);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(blogInfo.name)}</title>`;
    $$payload2.out += `<meta name="description" content="Our blog posts.">`;
  });
  $$payload.out += `<div class="py-8 lg:py-12 px-6 max-w-lg mx-auto"><div class="text-3xl lg:text-5xl font-medium text-primary text-center"><div class="leading-relaxed font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">${escape_html(blogInfo.name)}</div></div> <div class="text-lg text-center">Some helpful content to get you started!</div> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let post = each_array[$$index];
    $$payload.out += `<a${attr("href", post.link)}><div class="card my-6 bg-base-200 shadow-xl border border-base-content/5 flex-row overflow-hidden hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"><div class="flex-none w-6 md:w-32 bg-base-300"></div> <div class="py-6 px-6"><div class="text-xl text-base-content font-bold mb-2">${escape_html(post.title)}</div> <div class="text-sm text-primary mb-3">${escape_html(post.parsedDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }))}</div> <div class="text-base-content/70 text-sm leading-relaxed">${escape_html(post.description)}</div></div></div></a>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
