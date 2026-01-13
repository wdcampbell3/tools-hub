<script lang="ts">
  type Category = "length" | "weight" | "volume" | "temperature"

  let activeCategory = $state<Category>("length")

  // Input states
  let createInput = $state(1)
  let fromUnit = $state("")
  let toUnit = $state("")

  // Conversion Logic Configuration
  const categories = {
    length: {
      name: "Length",
      icon: "📏",
      units: [
        { id: "mm", name: "Millimeters", factor: 0.001 },
        { id: "cm", name: "Centimeters", factor: 0.01 },
        { id: "m", name: "Meters", factor: 1 },
        { id: "km", name: "Kilometers", factor: 1000 },
        { id: "in", name: "Inches", factor: 0.0254 },
        { id: "ft", name: "Feet", factor: 0.3048 },
        { id: "yd", name: "Yards", factor: 0.9144 },
        { id: "mi", name: "Miles", factor: 1609.344 },
      ],
    },
    weight: {
      name: "Weight",
      icon: "⚖️",
      units: [
        { id: "mg", name: "Milligrams", factor: 0.001 },
        { id: "g", name: "Grams", factor: 1 },
        { id: "kg", name: "Kilograms", factor: 1000 },
        { id: "oz", name: "Ounces", factor: 28.3495 },
        { id: "lb", name: "Pounds", factor: 453.592 },
      ],
    },
    volume: {
      name: "Volume",
      icon: "🧪",
      units: [
        { id: "ml", name: "Milliliters", factor: 1 },
        { id: "l", name: "Liters", factor: 1000 },
        { id: "tsp", name: "Teaspoons", factor: 4.92892 },
        { id: "tbsp", name: "Tablespoons", factor: 14.7868 },
        { id: "fl_oz", name: "Fluid Ounces", factor: 29.5735 },
        { id: "cup", name: "Cups", factor: 236.588 },
        { id: "pt", name: "Pints", factor: 473.176 },
        { id: "qt", name: "Quarts", factor: 946.353 },
        { id: "gal", name: "Gallons", factor: 3785.41 },
      ],
    },
    temperature: {
      name: "Temperature",
      icon: "🌡️",
      units: [
        { id: "c", name: "Celsius" },
        { id: "f", name: "Fahrenheit" },
        { id: "k", name: "Kelvin" },
      ],
    },
  }

  // Initialize defaults when category changes
  function setCategory(cat: Category) {
    activeCategory = cat
    const units = categories[cat].units
    fromUnit = units[0].id // Default first option (e.g., Metric)
    toUnit =
      units.find(
        (u) =>
          u.name.includes("Feet") ||
          u.name.includes("Pounds") ||
          u.name.includes("Gallons") ||
          u.name.includes("Fahrenheit"),
      )?.id || units[1].id // Try to find an imperial default
  }

  // Initialize on mount (or just let the defaults work, currently fromUnit is empty so we need a init)
  $effect(() => {
    if (!fromUnit) setCategory("length")
  })

  // Calculation Logic
  let result = $derived.by(() => {
    if (activeCategory === "temperature") {
      const val = createInput
      if (fromUnit === toUnit) return val

      // Celsius base
      let cVal = 0
      if (fromUnit === "c") cVal = val
      else if (fromUnit === "f") cVal = ((val - 32) * 5) / 9
      else if (fromUnit === "k") cVal = val - 273.15

      if (toUnit === "c") return cVal
      if (toUnit === "f") return (cVal * 9) / 5 + 32
      if (toUnit === "k") return cVal + 273.15
      return 0
    } else {
      // Linear conversions
      const units = categories[activeCategory].units
      const fromFactor = units.find((u) => u.id === fromUnit)?.factor || 1
      const toFactor = units.find((u) => u.id === toUnit)?.factor || 1

      // Convert to base, then to target
      const baseValue = createInput * fromFactor
      return baseValue / toFactor
    }
  })

  // Formatting
  function format(num: number) {
    if (Math.abs(num) < 0.0001 && num !== 0) return num.toExponential(4)
    return parseFloat(num.toFixed(4)) // Strip trailing zeros
  }

  function swap() {
    const temp = fromUnit
    fromUnit = toUnit
    toUnit = temp
  }

  // Derived values for template
  let currentUnits = $derived(categories[activeCategory].units)
  let fromUnitObj = $derived(currentUnits.find((u) => u.id === fromUnit))
  let toUnitObj = $derived(currentUnits.find((u) => u.id === toUnit))
</script>

<div
  class="h-full flex flex-col items-center justify-center p-8 bg-base-100/50"
>
  <div
    class="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-200"
  >
    <div class="card-body p-0">
      <!-- Category Tabs (Header) -->
      <div
        class="flex flex-wrap border-b border-base-200 bg-base-200/30 rounded-t-xl"
      >
        {#each Object.entries(categories) as [key, cat]}
          <button
            class="flex-1 py-4 flex flex-col items-center gap-1 transition-all hover:bg-base-100
                   {activeCategory === key
              ? 'bg-base-100 text-primary border-b-2 border-primary -mb-[2px] font-bold'
              : 'text-base-content/60'}"
            onclick={() => setCategory(key as Category)}
          >
            <span class="text-2xl">{cat.icon}</span>
            <span class="text-sm uppercase tracking-wide">{cat.name}</span>
          </button>
        {/each}
      </div>

      <!-- Main Input Area -->
      <div class="p-8 grid gap-8">
        <!-- From Section -->
        <div class="relative group">
          <label
            class="label text-xs uppercase font-bold text-base-content/50 mb-1"
            for="input-val"
          >
            Convert from
          </label>
          <div class="flex items-center gap-4">
            <input
              id="input-val"
              type="number"
              bind:value={createInput}
              class="input input-lg input-ghost text-4xl font-bold w-full p-0 h-auto focus:bg-transparent focus:outline-0 placeholder-base-content/20"
              placeholder="0"
            />
            <select
              bind:value={fromUnit}
              class="select select-bordered select-lg max-w-xs font-medium"
            >
              {#each currentUnits as unit}
                <option value={unit.id}>{unit.name}</option>
              {/each}
            </select>
          </div>
          <div
            class="h-[1px] bg-base-200 w-full mt-2 group-focus-within:bg-primary transition-colors"
          ></div>
        </div>

        <!-- Swap Divider -->
        <div class="flex items-center justify-center -my-4 z-10">
          <button
            class="btn btn-circle btn-sm btn-outline bg-base-100 hover:rotate-180 transition-transform"
            onclick={swap}
            aria-label="Swap units"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path d="M7 10h14l-4-4" /><path d="M17 14H3l4 4" /></svg
            >
          </button>
        </div>

        <!-- To Section -->
        <div class="relative">
          <label
            class="label text-xs uppercase font-bold text-base-content/50 mb-1"
            for="output-val"
          >
            To
          </label>
          <div class="flex items-center gap-4 opacity-100">
            <div
              class="text-4xl font-bold text-primary w-full truncate"
              title={result.toString()}
            >
              {format(result)}
            </div>
            <select
              bind:value={toUnit}
              class="select select-bordered select-lg max-w-xs font-medium"
            >
              {#each currentUnits as unit}
                <option value={unit.id}>{unit.name}</option>
              {/each}
            </select>
          </div>
          <!-- Visual representation (fake underline for symmetry) -->
          <div class="h-[1px] bg-base-200 w-full mt-2"></div>
        </div>
      </div>

      <!-- Quick Summary Footer -->
      <div
        class="bg-base-200/50 p-4 text-center text-sm text-base-content/60 rounded-b-xl"
      >
        1 {fromUnitObj?.name} = {format(result / createInput)}
        {toUnitObj?.name}
      </div>
    </div>
  </div>
</div>
