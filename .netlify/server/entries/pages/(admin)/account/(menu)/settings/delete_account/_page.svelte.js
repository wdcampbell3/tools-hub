import { Z as getContext, S as head, X as stringify, R as pop, P as push } from "../../../../../../../chunks/index.js";
import { S as Settings_module } from "../../../../../../../chunks/settings_module.js";
function _page($$payload, $$props) {
  push();
  let adminSection = getContext("adminSection");
  adminSection.set("settings");
  let { data } = $$props;
  let { user } = data;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Delete Account</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-6">Settings</h1> `;
  Settings_module($$payload, {
    title: "Delete Account",
    editable: true,
    dangerous: true,
    message: `Deleting your account can not be undone. You are currently logged in as '${stringify(user?.email)}'`,
    saveButtonTitle: "Delete Account",
    successTitle: "Account queued for deletion",
    successBody: "Your account will be deleted shortly.",
    formTarget: "/account/api?/deleteAccount",
    fields: [
      {
        id: "currentPassword",
        label: "Current Password",
        initialValue: "",
        inputType: "password"
      }
    ]
  });
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
