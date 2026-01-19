import { Y as ensure_array_like, R as pop, P as push, X as stringify, S as head } from "../../../../chunks/index.js";
import { a as attr } from "../../../../chunks/attributes.js";
import { e as escape_html } from "../../../../chunks/escaping.js";
function Converter($$payload, $$props) {
  push();
  let activeCategory = "length";
  let createInput = 1;
  let fromUnit = "";
  let toUnit = "";
  const categories = {
    length: {
      name: "Length",
      icon: "📏",
      units: [
        { id: "mm", name: "Millimeters", factor: 1e-3 },
        { id: "cm", name: "Centimeters", factor: 0.01 },
        { id: "m", name: "Meters", factor: 1 },
        { id: "km", name: "Kilometers", factor: 1e3 },
        { id: "in", name: "Inches", factor: 0.0254 },
        { id: "ft", name: "Feet", factor: 0.3048 },
        { id: "yd", name: "Yards", factor: 0.9144 },
        { id: "mi", name: "Miles", factor: 1609.344 }
      ]
    },
    weight: {
      name: "Weight",
      icon: "⚖️",
      units: [
        { id: "mg", name: "Milligrams", factor: 1e-3 },
        { id: "g", name: "Grams", factor: 1 },
        { id: "kg", name: "Kilograms", factor: 1e3 },
        { id: "oz", name: "Ounces", factor: 28.3495 },
        { id: "lb", name: "Pounds", factor: 453.592 }
      ]
    },
    volume: {
      name: "Volume",
      icon: "🧪",
      units: [
        { id: "ml", name: "Milliliters", factor: 1 },
        { id: "l", name: "Liters", factor: 1e3 },
        {
          id: "tsp",
          name: "Teaspoons",
          factor: 4.92892
        },
        {
          id: "tbsp",
          name: "Tablespoons",
          factor: 14.7868
        },
        {
          id: "fl_oz",
          name: "Fluid Ounces",
          factor: 29.5735
        },
        { id: "cup", name: "Cups", factor: 236.588 },
        { id: "pt", name: "Pints", factor: 473.176 },
        { id: "qt", name: "Quarts", factor: 946.353 },
        { id: "gal", name: "Gallons", factor: 3785.41 }
      ]
    },
    temperature: {
      name: "Temperature",
      icon: "🌡️",
      units: [
        { id: "c", name: "Celsius" },
        { id: "f", name: "Fahrenheit" },
        { id: "k", name: "Kelvin" }
      ]
    }
  };
  let result = (() => {
    {
      const units = categories[activeCategory].units;
      const fromFactor = units.find((u) => u.id === fromUnit)?.factor || 1;
      const toFactor = units.find((u) => u.id === toUnit)?.factor || 1;
      const baseValue = createInput * fromFactor;
      return baseValue / toFactor;
    }
  })();
  function format(num) {
    if (Math.abs(num) < 1e-4 && num !== 0) return num.toExponential(4);
    return parseFloat(num.toFixed(4));
  }
  let currentUnits = categories[activeCategory].units;
  let fromUnitObj = currentUnits.find((u) => u.id === fromUnit);
  let toUnitObj = currentUnits.find((u) => u.id === toUnit);
  const each_array = ensure_array_like(Object.entries(categories));
  const each_array_1 = ensure_array_like(currentUnits);
  const each_array_2 = ensure_array_like(currentUnits);
  $$payload.out += `<div class="h-full flex flex-col items-center justify-center p-8 bg-base-100/50"><div class="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-200"><div class="card-body p-0"><div class="flex flex-wrap border-b border-base-200 bg-base-200/30 rounded-t-xl"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let [key, cat] = each_array[$$index];
    $$payload.out += `<button${attr("class", `flex-1 py-4 flex flex-col items-center gap-1 transition-all hover:bg-base-100 ${stringify(activeCategory === key ? "bg-base-100 text-primary border-b-2 border-primary -mb-[2px] font-bold" : "text-base-content/60")}`)}><span class="text-2xl">${escape_html(cat.icon)}</span> <span class="text-sm uppercase tracking-wide">${escape_html(cat.name)}</span></button>`;
  }
  $$payload.out += `<!--]--></div> <div class="p-8 grid gap-8"><div class="relative group"><label class="label text-xs uppercase font-bold text-base-content/50 mb-1" for="input-val">Convert from</label> <div class="flex items-center gap-4"><input id="input-val" type="number"${attr("value", createInput)} class="input input-lg input-ghost text-4xl font-bold w-full p-0 h-auto focus:bg-transparent focus:outline-0 placeholder-base-content/20" placeholder="0"> <select class="select select-bordered select-lg max-w-xs font-medium"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let unit = each_array_1[$$index_1];
    $$payload.out += `<option${attr("value", unit.id)}>${escape_html(unit.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="h-[1px] bg-base-200 w-full mt-2 group-focus-within:bg-primary transition-colors"></div></div> <div class="flex items-center justify-center -my-4 z-10"><button class="btn btn-circle btn-sm btn-outline bg-base-100 hover:rotate-180 transition-transform" aria-label="Swap units"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10h14l-4-4"></path><path d="M17 14H3l4 4"></path></svg></button></div> <div class="relative"><label class="label text-xs uppercase font-bold text-base-content/50 mb-1" for="output-val">To</label> <div class="flex items-center gap-4 opacity-100"><div class="text-4xl font-bold text-primary w-full truncate"${attr("title", result.toString())}>${escape_html(format(result))}</div> <select class="select select-bordered select-lg max-w-xs font-medium"><!--[-->`;
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let unit = each_array_2[$$index_2];
    $$payload.out += `<option${attr("value", unit.id)}>${escape_html(unit.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="h-[1px] bg-base-200 w-full mt-2"></div></div></div> <div class="bg-base-200/50 p-4 text-center text-sm text-base-content/60 rounded-b-xl">1 ${escape_html(fromUnitObj?.name)} = ${escape_html(format(result / createInput))}
        ${escape_html(toUnitObj?.name)}</div></div></div></div>`;
  pop();
}
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Unit Converter | Dougie's Tool Hub</title>`;
  });
  $$payload.out += `<div class="h-full w-full overflow-y-auto p-4 lg:p-8"><div class="container mx-auto max-w-2xl">`;
  Converter($$payload);
  $$payload.out += `<!----></div></div>`;
}
export {
  _page as default
};
