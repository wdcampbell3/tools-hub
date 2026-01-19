import { Y as ensure_array_like, X as stringify, R as pop, P as push } from "../../../../chunks/index.js";
import "../../../../chunks/client.js";
import { a as attr } from "../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function _page($$payload, $$props) {
  push();
  let errors = {};
  const formFields = [
    {
      id: "first_name",
      label: "First Name *",
      inputType: "text",
      autocomplete: "given-name"
    },
    {
      id: "last_name",
      label: "Last Name *",
      inputType: "text",
      autocomplete: "family-name"
    },
    {
      id: "email",
      label: "Email *",
      inputType: "email",
      autocomplete: "email"
    },
    {
      id: "phone",
      label: "Phone Number",
      inputType: "tel",
      autocomplete: "tel"
    },
    {
      id: "company",
      label: "Company Name",
      inputType: "text",
      autocomplete: "organization"
    },
    {
      id: "message",
      label: "Message",
      inputType: "textarea",
      autocomplete: "off"
    }
  ];
  $$payload.out += `<div class="flex flex-col lg:flex-row mx-auto my-4 min-h-[70vh] place-items-center lg:place-items-start place-content-center"><div class="max-w-[400px] lg:max-w-[500px] flex flex-col place-content-center p-4 lg:mr-8 lg:mb-8 lg:min-h-[70vh]"><div class="px-6"><h1 class="text-2xl lg:text-4xl font-bold mb-4">Contact Us</h1> <p class="text-lg">Talk to one of our service professionals to:</p> <ul class="list-disc list-outside pl-6 py-4 space-y-1"><li>Get a live demo</li> <li>Discuss your specific needs</li> <li>Get a quote</li> <li>Answer any technical questions you have</li></ul> <p>Once you complete the form, we'll reach out to you! *</p> <p class="text-sm pt-8">*Not really for this demo page, but you should say something like that
        😉</p></div></div> <div class="flex flex-col grow m-4 lg:ml-10 min-w-[300px] stdphone:min-w-[360px] max-w-[400px] place-content-center lg:min-h-[70vh]">`;
  {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(formFields);
    $$payload.out += `<div class="card card-bordered shadow-lg p-4 pt-6 mx-2 lg:mx-0 lg:p-6"><form class="form-widget flex flex-col" method="POST" action="?/submitContactUs"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let field = each_array[$$index];
      $$payload.out += `<label${attr("for", field.id)}><div class="flex flex-row"><div class="text-base font-bold">${escape_html(field.label)}</div> `;
      if (errors[field.id]) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="text-red-600 grow text-sm ml-2 text-right">${escape_html(errors[field.id])}</div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> `;
      if (field.inputType === "textarea") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<textarea${attr("id", field.id)}${attr("name", field.id)}${attr("autocomplete", field.autocomplete)}${attr("rows", 4)}${attr("class", `${stringify(errors[field.id] ? "input-error" : "")} h-24 input-sm mt-1 input input-bordered w-full mb-3 text-base py-4`)}></textarea>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<input${attr("id", field.id)}${attr("name", field.id)}${attr("type", field.inputType)}${attr("autocomplete", field.autocomplete)}${attr("class", `${stringify(errors[field.id] ? "input-error" : "")} input-sm mt-1 input input-bordered w-full mb-3 text-base py-4`)}>`;
      }
      $$payload.out += `<!--]--></label>`;
    }
    $$payload.out += `<!--]--> `;
    if (Object.keys(errors).length > 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-red-600 text-sm mb-2">Please resolve above issues.</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <button${attr("class", `btn btn-primary ${stringify("")}`)}>${escape_html("Submit")}</button></form></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
export {
  _page as default
};
