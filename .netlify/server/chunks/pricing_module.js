import { Y as ensure_array_like, X as stringify } from "./index.js";
import { p as pricingPlans } from "./pricing_plans.js";
import { a as attr } from "./attributes.js";
import { e as escape_html } from "./escaping.js";
function Pricing_module($$payload, $$props) {
  let {
    highlightedPlanId = "",
    callToAction,
    currentPlanId = "",
    center = true
  } = $$props;
  const each_array = ensure_array_like(pricingPlans);
  $$payload.out += `<div${attr("class", `flex flex-col lg:flex-row gap-10 ${stringify(center ? "place-content-center" : "")} flex-wrap`)}><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let plan = each_array[$$index_1];
    const each_array_1 = ensure_array_like(plan.features);
    $$payload.out += `<div${attr("class", `flex-none card ${stringify(plan.id === highlightedPlanId ? "border-primary border-2" : "")} shadow-xl flex-1 grow min-w-[260px] max-w-[310px] p-6 hover:shadow-2xl transition-all`)}><div class="flex flex-col h-full"><div class="text-xl font-bold text-base-content">${escape_html(plan.name)}</div> <p class="mt-2 text-sm text-base-content/70 leading-relaxed">${escape_html(plan.description)}</p> <div class="mt-auto pt-4 text-sm text-base-content/80">Plan Includes: <ul class="list-disc list-inside mt-2 space-y-1"><!--[-->`;
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let feature = each_array_1[$$index];
      $$payload.out += `<li>${escape_html(feature)}</li>`;
    }
    $$payload.out += `<!--]--> <ul></ul></ul></div> <div class="pt-8"><span class="text-4xl font-bold text-base-content">${escape_html(plan.price)}</span> <span class="text-base-content/50">${escape_html(plan.priceIntervalName)}</span> <div class="mt-6 pt-4 flex-1 flex flex-row items-center">`;
    if (plan.id === currentPlanId) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="btn btn-outline btn-success no-animation w-[80%] mx-auto cursor-default">Current Plan</div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<a${attr("href", "/account/subscribe/" + (plan?.stripe_price_id ?? "free_plan"))} class="btn btn-primary w-[80%] mx-auto">${escape_html(callToAction)}</a>`;
    }
    $$payload.out += `<!--]--></div></div></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
}
export {
  Pricing_module as P
};
