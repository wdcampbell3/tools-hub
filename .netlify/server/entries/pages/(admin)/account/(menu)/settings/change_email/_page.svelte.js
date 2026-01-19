import { Z as getContext, S as head, R as pop, P as push } from "../../../../../../../chunks/index.js";
import { S as Settings_module } from "../../../../../../../chunks/settings_module.js";
function _page($$payload, $$props) {
  push();
  let adminSection = getContext("adminSection");
  adminSection.set("settings");
  let { data } = $$props;
  let { user } = data;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Change Email</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-6">Settings</h1> `;
  Settings_module($$payload, {
    title: "Change Email",
    editable: true,
    successTitle: "Email change initiated",
    successBody: "You should receive emails at both the old and new address to confirm the change. Please click the link in both emails to finalized the change. Until finalized, you must sign in with your current email.",
    formTarget: "/account/api?/updateEmail",
    fields: [
      {
        id: "email",
        label: "Email",
        initialValue: user?.email ?? "",
        placeholder: "Email address"
      }
    ]
  });
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
