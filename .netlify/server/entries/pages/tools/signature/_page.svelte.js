import { R as pop, P as push, X as stringify, S as head } from "../../../../chunks/index.js";
import { a as attr } from "../../../../chunks/attributes.js";
import { h as html } from "../../../../chunks/html.js";
function SignatureMaker($$payload, $$props) {
  push();
  let fullName = "";
  let jobTitle = "";
  let company = "";
  let email = "";
  let phone = "";
  let website = "";
  let fontColor = "#1f2937";
  let sidebarColor = "#4b5563";
  let socialLinks = [];
  const platformIcons = {
    LinkedIn: "/images/social-icons/LinkedIn-60.jpg",
    X: "/images/social-icons/X-logo-60.jpg",
    Facebook: "/images/social-icons/Facebook-60.jpg",
    Instagram: "/images/social-icons/instagram-60.jpg",
    YouTube: "/images/social-icons/YouTube-Logo 60.jpg"
  };
  let signatureHTML = (() => {
    const socialLinksHTML = socialLinks.map((link) => {
      const iconSrc = platformIcons[link.platform];
      return iconSrc ? `<a href="${link.url}" style="text-decoration: none; margin-right: 6px;"><img src="${iconSrc}" alt="${link.platform}" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;" /></a>` : "";
    }).join("");
    {
      return `
<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; max-width: 600px; width: 100%; table-layout: fixed;">
  <tr>
    ${""}
    <td style="border-left: 3px solid ${sidebarColor}; padding-left: 20px; vertical-align: top;">
      ${""}
      ${""}
      ${""}
      ${""}
      ${""}
      ${""}
      ${socialLinksHTML ? `<div style="margin-top: 8px;">${socialLinksHTML}</div>` : ""}
    </td>
    ${""}
  </tr>
</table>`;
    }
  })();
  $$payload.out += `<div class="h-full flex overflow-hidden"><div class="w-1/2 overflow-auto bg-base-100 p-8"><div class="max-w-2xl"><h1 class="text-3xl font-bold mb-2">Create Your Signature</h1> <p class="text-base-content/60 mb-8">Fill in your details and watch your signature come to life in real-time.</p> <div class="flex gap-2 mb-6"><button${attr("class", `btn flex-1 ${stringify("btn-primary")}`)}>Basic Info</button> <button${attr("class", `btn flex-1 ${stringify("btn-ghost bg-base-200")}`)}>Social Links</button> <button${attr("class", `btn flex-1 ${stringify("btn-ghost bg-base-200")}`)}>Template</button></div> <div class="space-y-6">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="form-control"><label class="label" for="fullName"><span class="label-text font-semibold">Full Name <span class="text-error">*</span></span></label> <input id="fullName" type="text"${attr("value", fullName)} class="input input-bordered w-full" placeholder="John Doe"></div> <div class="form-control"><label class="label" for="jobTitle"><span class="label-text font-semibold">Job Title</span></label> <input id="jobTitle" type="text"${attr("value", jobTitle)} class="input input-bordered w-full" placeholder="Software Engineer"></div> <div class="form-control"><label class="label" for="company"><span class="label-text font-semibold">Company</span></label> <input id="company" type="text"${attr("value", company)} class="input input-bordered w-full" placeholder="Acme Inc."></div> <div class="form-control"><label class="label" for="email"><span class="label-text font-semibold">Email</span></label> <input id="email" type="email"${attr("value", email)} class="input input-bordered w-full" placeholder="john@example.com"></div> <div class="form-control"><label class="label" for="phone"><span class="label-text font-semibold">Phone</span></label> <input id="phone" type="tel"${attr("value", phone)} class="input input-bordered w-full" placeholder="(555) 123-4567"></div> <div class="form-control"><label class="label" for="website"><span class="label-text font-semibold">Website</span></label> <input id="website" type="text"${attr("value", website)} class="input input-bordered w-full" placeholder="www.example.com"></div> <div class="form-control"><label class="label" for="logoUpload"><span class="label-text font-semibold">Logo Upload</span></label> <input id="logoUpload" type="file" accept="image/*" class="file-input file-input-bordered w-full"> <div class="label"><span class="label-text-alt">Upload your logo (GIF, PNG, or JPG - max 80x80px recommended)</span></div> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div class="form-control"><div class="label"><span class="label-text font-semibold">Logo Position</span></div> <div class="flex gap-4"><button${attr("class", `btn flex-1 ${stringify("btn-primary")}`)}>Left Side</button> <button${attr("class", `btn flex-1 ${stringify("btn-outline")}`)}>Right Side</button></div></div> <div class="form-control"><label class="label" for="fontColor"><span class="label-text font-semibold">Font Color</span></label> <div class="flex gap-4 items-center"><input id="fontColor" type="color"${attr("value", fontColor)} class="w-16 h-12 rounded cursor-pointer border-2 border-base-300"> <input type="text"${attr("value", fontColor)} class="input input-bordered flex-1" placeholder="#1f2937"></div></div> <div class="form-control"><label class="label" for="sidebarColor"><span class="label-text font-semibold">Highlight Color</span></label> <div class="flex gap-4 items-center"><input id="sidebarColor" type="color"${attr("value", sidebarColor)} class="w-16 h-12 rounded cursor-pointer border-2 border-base-300"> <input type="text"${attr("value", sidebarColor)} class="input input-bordered flex-1" placeholder="#4b5563"></div></div>`;
  }
  $$payload.out += `<!--]--></div></div></div> <div class="w-1/2 overflow-auto bg-base-200 p-8"><div class="sticky top-0"><div class="flex justify-between items-center mb-4"><h2 class="text-2xl font-bold">Live Preview</h2> <button class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path></svg> Copy</button></div> <div class="card bg-base-100 shadow-xl p-8 mb-6"><div class="preview-container">${html(signatureHTML)}</div> <div class="text-center text-sm text-base-content/50 mt-4 pt-4 border-t border-base-300">This is how your signature will appear in emails</div></div> <div class="collapse collapse-arrow bg-base-100 mb-4"><input type="checkbox" checked> <div class="collapse-title text-lg font-bold">How to Use This Tool</div> <div class="collapse-content"><div class="space-y-2 text-sm"><p class="font-semibold">Step-by-Step Instructions:</p> <ol class="list-decimal list-inside space-y-1 text-base-content/70"><li>Fill in your information in the form above</li> <li>Choose your preferred template style</li> <li>Click the "Copy Signature" button</li> <li>Open Gmail and go to Settings (gear icon) → See all settings</li> <li>Scroll down to the "Signature" section</li> <li>Click "Create new" or select an existing signature</li> <li>Click in the signature text box and paste (Ctrl+V or Cmd+V)</li> <li>Scroll down and click "Save Changes"</li></ol></div></div></div></div></div></div>`;
  pop();
}
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Gmail Signature Maker | Dougie's Tool Hub</title>`;
  });
  $$payload.out += `<div class="h-full w-full overflow-y-auto p-4 lg:p-8"><div class="container mx-auto max-w-5xl">`;
  SignatureMaker($$payload);
  $$payload.out += `<!----></div></div>`;
}
export {
  _page as default
};
