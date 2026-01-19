import { Z as getContext, S as head, R as pop, P as push } from "../../../../../../../chunks/index.js";
import { S as Settings_module } from "../../../../../../../chunks/settings_module.js";
function _page($$payload, $$props) {
  push();
  let adminSection = getContext("adminSection");
  adminSection.set("settings");
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Reset Password</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-6">Settings</h1> `;
  Settings_module($$payload, {
    title: "Reset Password",
    editable: true,
    saveButtonTitle: "Reset Password",
    successTitle: "Password Changed",
    successBody: "On next sign in, use your new password.",
    formTarget: "/account/api?/updatePassword",
    fields: [
      {
        id: "newPassword1",
        label: "New Password",
        initialValue: "",
        inputType: "password"
      },
      {
        id: "newPassword2",
        label: "Confirm New Password",
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
