import { S as head } from "../../../../chunks/index.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function Calculator($$payload) {
  let display = "0";
  $$payload.out += `<div class="flex flex-col items-center justify-center h-full p-8"><div class="card bg-base-200 shadow-xl w-full max-w-md"><div class="card-body p-6"><h2 class="card-title text-2xl mb-4 flex items-center gap-2"><span class="text-3xl">🧮</span> Calculator</h2> <div class="bg-base-300 rounded-lg p-6 mb-4"><div class="text-right text-4xl font-mono font-bold break-all">${escape_html(display)}</div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="grid grid-cols-4 gap-2"><button class="btn btn-error">C</button> <button class="btn btn-neutral">⌫</button> <button class="btn btn-neutral">+/-</button> <button class="btn btn-primary">÷</button> <button class="btn btn-neutral">7</button> <button class="btn btn-neutral">8</button> <button class="btn btn-neutral">9</button> <button class="btn btn-primary">×</button> <button class="btn btn-neutral">4</button> <button class="btn btn-neutral">5</button> <button class="btn btn-neutral">6</button> <button class="btn btn-primary">-</button> <button class="btn btn-neutral">1</button> <button class="btn btn-neutral">2</button> <button class="btn btn-neutral">3</button> <button class="btn btn-primary">+</button> <button class="btn btn-neutral col-span-2">0</button> <button class="btn btn-neutral">.</button> <button class="btn btn-success">=</button></div></div></div></div>`;
}
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Calculator | Dougie's Tool Hub</title>`;
  });
  $$payload.out += `<div class="h-full w-full overflow-y-auto p-4 lg:p-8"><div class="container mx-auto max-w-2xl">`;
  Calculator($$payload);
  $$payload.out += `<!----></div></div>`;
}
export {
  _page as default
};
