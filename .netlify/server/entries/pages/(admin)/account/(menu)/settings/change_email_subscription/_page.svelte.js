import { S as head } from "../../../../../../../chunks/index.js";
import { S as Settings_module } from "../../../../../../../chunks/settings_module.js";
function _page($$payload, $$props) {
  let { data } = $$props;
  let { profile } = data;
  let unsubscribed = profile?.unsubscribed;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Change Email Subscription</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-6">Email Subscription</h1> `;
  Settings_module($$payload, {
    editable: true,
    title: "Subscription",
    message: unsubscribed ? "You are currently unsubscribed from emails" : "You are currently subscribed to emails",
    saveButtonTitle: unsubscribed ? "Re-subscribe" : "Unsubscribe",
    successBody: unsubscribed ? "You have been re-subscribed to emails" : "You have been unsubscribed from emails",
    formTarget: "/account/api?/toggleEmailSubscription",
    fields: []
  });
  $$payload.out += `<!---->`;
}
export {
  _page as default
};
