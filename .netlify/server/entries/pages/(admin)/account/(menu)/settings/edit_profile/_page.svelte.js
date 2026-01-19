import { Z as getContext, S as head, R as pop, P as push } from "../../../../../../../chunks/index.js";
import { S as Settings_module } from "../../../../../../../chunks/settings_module.js";
function _page($$payload, $$props) {
  push();
  let adminSection = getContext("adminSection");
  adminSection.set("settings");
  let { data } = $$props;
  let { profile } = data;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Edit Profile</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-6">Settings</h1> `;
  Settings_module($$payload, {
    editable: true,
    title: "Edit Profile",
    successTitle: "Saved Profile",
    formTarget: "/account/api?/updateProfile",
    fields: [
      {
        id: "fullName",
        label: "Name",
        initialValue: profile?.full_name ?? "",
        placeholder: "Your full name",
        maxlength: 50
      },
      {
        id: "companyName",
        label: "Company Name",
        initialValue: profile?.company_name ?? "",
        maxlength: 50
      },
      {
        id: "website",
        label: "Company Website",
        initialValue: profile?.website ?? "",
        maxlength: 50
      }
    ]
  });
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
