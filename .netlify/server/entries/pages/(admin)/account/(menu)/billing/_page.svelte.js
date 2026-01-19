import { Z as getContext, S as head, R as pop, P as push } from "../../../../../../chunks/index.js";
import { S as Settings_module } from "../../../../../../chunks/settings_module.js";
import { P as Pricing_module } from "../../../../../../chunks/pricing_module.js";
import { d as defaultPlanId, p as pricingPlans } from "../../../../../../chunks/pricing_plans.js";
import { e as escape_html } from "../../../../../../chunks/escaping.js";
function _page($$payload, $$props) {
  push();
  let adminSection = getContext("adminSection");
  adminSection.set("billing");
  let { data } = $$props;
  let currentPlanId = data.currentPlanId ?? defaultPlanId;
  let currentPlanName = pricingPlans.find((x) => x.id === data.currentPlanId)?.name;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Billing</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-2">${escape_html(data.isActiveCustomer ? "Billing" : "Select a Plan")}</h1> <div>View our <a href="/pricing" target="_blank" class="link">pricing page</a> for details.</div> `;
  if (!data.isActiveCustomer) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mt-8">`;
    Pricing_module($$payload, {
      currentPlanId,
      callToAction: "Select Plan",
      center: false
    });
    $$payload.out += `<!----></div> `;
    if (data.hasEverHadSubscription) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="mt-10"><a href="/account/billing/manage" class="link">View past invoices</a></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    Settings_module($$payload, {
      title: "Subscription",
      editable: false,
      fields: [
        {
          id: "plan",
          label: "Current Plan",
          initialValue: currentPlanName || ""
        }
      ],
      editButtonTitle: "Manage Subscription",
      editLink: "/account/billing/manage"
    });
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _page as default
};
