import { Z as getContext, S as head, R as pop, P as push } from "../../../../../../chunks/index.js";
import { S as Settings_module } from "../../../../../../chunks/settings_module.js";
function _page($$payload, $$props) {
  push();
  let adminSection = getContext("adminSection");
  adminSection.set("settings");
  let { data } = $$props;
  let { profile, user } = data;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Settings</title>`;
  });
  $$payload.out += `<h1 class="text-2xl font-bold mb-6">Settings</h1> `;
  Settings_module($$payload, {
    title: "Profile",
    editable: false,
    fields: [
      {
        id: "fullName",
        label: "Name",
        initialValue: profile?.full_name ?? ""
      },
      {
        id: "companyName",
        label: "Company Name",
        initialValue: profile?.company_name ?? ""
      },
      {
        id: "website",
        label: "Company Website",
        initialValue: profile?.website ?? ""
      }
    ],
    editButtonTitle: "Edit Profile",
    editLink: "/account/settings/edit_profile"
  });
  $$payload.out += `<!----> `;
  Settings_module($$payload, {
    title: "Email",
    editable: false,
    fields: [
      { id: "email", initialValue: user?.email || "" }
    ],
    editButtonTitle: "Change Email",
    editLink: "/account/settings/change_email"
  });
  $$payload.out += `<!----> `;
  Settings_module($$payload, {
    title: "Password",
    editable: false,
    fields: [
      {
        id: "password",
        initialValue: "••••••••••••••••"
      }
    ],
    editButtonTitle: "Change Password",
    editLink: "/account/settings/change_password"
  });
  $$payload.out += `<!----> `;
  Settings_module($$payload, {
    title: "Email Subscription",
    editable: false,
    fields: [
      {
        id: "subscriptionStatus",
        initialValue: profile?.unsubscribed ? "Unsubscribed" : "Subscribed"
      }
    ],
    editButtonTitle: "Change Subscription",
    editLink: "/account/settings/change_email_subscription"
  });
  $$payload.out += `<!----> `;
  Settings_module($$payload, {
    title: "Danger Zone",
    editable: false,
    dangerous: true,
    fields: [],
    editButtonTitle: "Delete Account",
    editLink: "/account/settings/delete_account"
  });
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
