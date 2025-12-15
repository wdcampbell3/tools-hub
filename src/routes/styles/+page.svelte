<script lang="ts">
  import { onMount } from "svelte"
  import { DEFAULT_THEME } from "$lib/theme-defaults"

  // Theme toggle state
  let isLight = false
  const themeLight = "saasstartertheme-light"
  const themeDark = "saasstartertheme"

  // Project default toggle state
  let projectDefaultIsLight = false

  // Default Link color toggle
  let defaultLinkIsPrimary = false

  // Color Palette Data with metadata
  const colorDefs = [
    {
      key: "--color-primary",
      label: "Primary",
      description: "Brand Action, Links",
    },
    {
      key: "--color-secondary",
      label: "Secondary",
      description: "Decorators, Alt Buttons",
    },
    {
      key: "--color-accent",
      label: "Accent",
      description: "Highlights, Focus Rings",
    },
    {
      key: "--color-neutral",
      label: "Neutral",
      description: "Dark Surfaces, Footers",
    },

    {
      key: "--color-base-content",
      label: "Base Text",
      description: "Main Body Text",
    },
    {
      key: "--color-base-100",
      label: "Base 100",
      description: "Main Background",
    },
    {
      key: "--color-base-200",
      label: "Base 200",
      description: "Cards, Inputs, Sidebar",
    },
    {
      key: "--color-base-300",
      label: "Base 300",
      description: "Hover States, Borders",
    },

    { key: "--color-info", label: "Info", description: "Alerts, Badges" },
    {
      key: "--color-success",
      label: "Success",
      description: "Completion, Success",
    },
    {
      key: "--color-warning",
      label: "Warning",
      description: "Caution, Attention",
    },
    {
      key: "--color-error",
      label: "Error",
      description: "Destructive, Failures",
    },
  ]

  // Dual State Store
  let lightColors: Record<string, string> = {}
  let darkColors: Record<string, string> = {}
  let isSaving = false
  let saveMessage = ""
  let defaultSaveMessage = ""
  // let isLoading = true; // Unused variable removed;

  // Computed: Current active colors for the UI inputs
  // We modify this object directly in the UI, but we must sync it back to the main state
  $: currentColors = isLight ? lightColors : darkColors

  onMount(async () => {
    // 1. Fetch source of truth from app.css
    let fetchedDefaultTheme = "dark" // fallback
    try {
      const res = await fetch("/api/theme/state")
      const data = await res.json()
      if (data.light && data.dark) {
        lightColors = data.light
        darkColors = data.dark

        // Set default toggle based on API response
        if (data.defaultTheme) {
          projectDefaultIsLight = data.defaultTheme === "light"
          fetchedDefaultTheme = data.defaultTheme
        }
      }
    } catch (e) {
      console.error("Failed to fetch initial theme state", e)
    }

    // 2. Initialize Theme Mode - check localStorage first, then use project default
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      isLight = savedTheme === themeLight
    } else {
      // Use project default (fetched from CSS)
      isLight = fetchedDefaultTheme === "light"
    }

    applyTheme(isLight)
    // Pass colors directly since reactive currentColors hasn't updated yet
    updateLinkToggleState(isLight ? lightColors : darkColors)
  })

  function updateLinkToggleState(colors?: Record<string, string>) {
    // Check the current theme's link color setting
    const colorsToCheck = colors ?? currentColors
    const linkColor = colorsToCheck["--main-link-color"]
    defaultLinkIsPrimary = !!linkColor && linkColor.includes("primary")
  }

  function applyTheme(light: boolean) {
    const themeName = light ? themeLight : themeDark
    document.documentElement.setAttribute("data-theme", themeName)

    // Clear conflicting inline styles first to let data-theme take over base
    // Then apply our specific overrides from state
    const colorsToApply = light ? lightColors : darkColors

    // We need to set CSS variables on the document element so the preview updates in real-time
    // However, we only need to set the variables that DIFFER from the CSS file if we haven't saved.
    // For simplicity in this editor, we enforce the current state's variables as inline styles.
    Object.keys(colorsToApply).forEach((key) => {
      document.documentElement.style.removeProperty(key)
    })

    Object.entries(colorsToApply).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })

    // Ensure the toggle reflects the new theme's state
    updateLinkToggleState()
  }

  function toggleTheme() {
    isLight = !isLight
    localStorage.setItem("theme", isLight ? themeLight : themeDark)
    applyTheme(isLight)
  }

  let linkSaveMessage = "" // Added linkSaveMessage state variable

  async function toggleDefaultLinkColor() {
    defaultLinkIsPrimary = !defaultLinkIsPrimary
    const newVal = defaultLinkIsPrimary ? "var(--color-primary)" : "inherit"

    // Update BOTH light and dark themes (global setting, not per-theme)
    lightColors["--main-link-color"] = newVal
    darkColors["--main-link-color"] = newVal
    lightColors = lightColors // Trigger reactivity
    darkColors = darkColors // Trigger reactivity

    // Apply to current view
    document.documentElement.style.setProperty("--main-link-color", newVal)

    // Auto-save logic
    try {
      await fetch("/api/theme/save", {
        method: "POST",
        body: JSON.stringify({
          colors: { light: lightColors, dark: darkColors },
          defaultTheme: projectDefaultIsLight ? "light" : "dark",
        }),
        headers: { "Content-Type": "application/json" },
      })
      linkSaveMessage = "Saved!"
      setTimeout(() => (linkSaveMessage = ""), 2000)
    } catch (e) {
      console.error("Failed to save default link color:", e)
      linkSaveMessage = "Error!"
      setTimeout(() => (linkSaveMessage = ""), 2000)
    }
  }

  // Update state when color picker changes
  function updateColor(key: string, value: string) {
    // 1. Update the CSS variable for real-time preview
    document.documentElement.style.setProperty(key, value)

    // 2. Update the specific state object
    if (isLight) {
      lightColors[key] = value
      lightColors = lightColors // Trigger reactivity
    } else {
      darkColors[key] = value
      darkColors = darkColors // Trigger reactivity
    }
  }

  // --- Persistence Features ---

  function restoreDefaults() {
    if (
      confirm(
        "Are you sure you want to restore the default theme colors? This will overwrite your current unsaved changes.",
      )
    ) {
      lightColors = { ...DEFAULT_THEME.light }
      darkColors = { ...DEFAULT_THEME.dark }
      applyTheme(isLight)
      alert(
        "Theme restored to defaults. Remember to 'Save' to make it permanent.",
      )
    }
  }

  async function saveProjectWide() {
    isSaving = true
    saveMessage = ""
    try {
      const response = await fetch("/api/theme/save", {
        method: "POST",
        body: JSON.stringify({
          colors: {
            light: lightColors,
            dark: darkColors,
          },
          defaultTheme: projectDefaultIsLight ? "light" : "dark",
        }),
        headers: { "Content-Type": "application/json" },
      })
      const result = await response.json()
      if (result.success) {
        saveMessage = "Saved successfully!"
        setTimeout(() => (saveMessage = ""), 3000)
      } else {
        saveMessage = "Error saving theme."
      }
    } catch (e) {
      saveMessage = "Network error."
      console.error(e)
    } finally {
      isSaving = false
    }
  }

  async function toggleProjectDefault() {
    projectDefaultIsLight = !projectDefaultIsLight
    // Auto-save the default theme change
    try {
      await fetch("/api/theme/save", {
        method: "POST",
        body: JSON.stringify({
          colors: { light: lightColors, dark: darkColors },
          defaultTheme: projectDefaultIsLight ? "light" : "dark",
        }),
        headers: { "Content-Type": "application/json" },
      })
      defaultSaveMessage = "Saved!"
      setTimeout(() => (defaultSaveMessage = ""), 2000)
    } catch (e) {
      console.error("Failed to save default theme:", e)
      defaultSaveMessage = "Error!"
      setTimeout(() => (defaultSaveMessage = ""), 2000)
    }
  }

  function exportTheme() {
    const exportData = { light: lightColors, dark: darkColors }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportData, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `theme-config.json`)
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  function importTheme(event: Event) {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return

    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)

        // Support both legacy single-export and new dual-export formats
        if (imported.light && imported.dark) {
          lightColors = { ...lightColors, ...imported.light }
          darkColors = { ...darkColors, ...imported.dark }
          alert("Imported Light & Dark themes!")
        } else {
          // Assume single theme object, apply to CURRENT mode
          if (isLight) {
            lightColors = { ...lightColors, ...imported }
          } else {
            darkColors = { ...darkColors, ...imported }
          }
          alert(`Imported colors into ${isLight ? "Light" : "Dark"} mode.`)
        }

        // Re-apply to show changes
        applyTheme(isLight)
      } catch (err) {
        alert("Invalid JSON file.")
      }
    }
    reader.readAsText(file)
  }
</script>

<svelte:head>
  <title>Styles & Examples - Freshbase SaaS Kit</title>
</svelte:head>

<div class="container mx-auto px-10 pb-10 space-y-24 relative">
  <!-- Top Bar with Toggles & Actions -->
  <div
    class="sticky top-0 z-50 bg-base-100 pt-10 flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-base-content/10 pb-10 gap-6"
  >
    <div>
      <h1 class="text-4xl font-bold mb-2">Design System</h1>
      <p class="text-base-content/70 text-lg">
        A unified reference for UI elements, colors, and typography.
      </p>
    </div>

    <div
      class="flex flex-col md:flex-row items-end md:items-center gap-6 w-full xl:w-auto"
    >
      <!-- Persistence Controls -->
      <div class="flex items-center gap-2">
        <input
          type="file"
          id="theme-import"
          class="hidden"
          accept=".json"
          onchange={importTheme}
        />
        <label for="theme-import" class="btn btn-sm btn-ghost">Import</label>
        <button class="btn btn-sm btn-ghost" onclick={exportTheme}
          >Export</button
        >
        <button class="btn btn-sm btn-ghost" onclick={restoreDefaults}
          >Restore</button
        >
        <button
          class="btn btn-sm btn-primary"
          onclick={saveProjectWide}
          disabled={isSaving}
        >
          {#if isSaving}<span class="loading loading-spinner loading-xs"
            ></span>{/if}
          Save
        </button>
        {#if saveMessage}
          <span class="text-xs text-success animate-fade-in px-2"
            >{saveMessage}</span
          >
        {/if}
      </div>

      <div class="divider md:divider-horizontal m-0"></div>

      <div class="flex flex-col items-end gap-3">
        <!-- Theme Toggle -->
        <div
          class="flex items-center gap-3 bg-base-200 p-2 rounded-full border border-base-content/10"
        >
          <span
            class="text-sm font-medium px-2 {isLight
              ? 'opacity-50'
              : 'text-primary'}">Dark</span
          >
          <input
            type="checkbox"
            class="toggle toggle-primary"
            checked={isLight}
            onchange={toggleTheme}
          />
          <span
            class="text-sm font-medium px-2 {isLight
              ? 'text-primary'
              : 'opacity-50'}">Light</span
          >
        </div>
      </div>
    </div>
  </div>

  <!-- Project Default Theme -->
  <section class="bg-base-200 p-6 rounded-box border border-base-content/10">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h2 class="text-lg font-bold">Project Default Theme</h2>
        <p class="text-sm opacity-70">
          The initial theme new visitors will see when they first arrive.
        </p>
      </div>
      <div class="flex items-center gap-3">
        {#if defaultSaveMessage}
          <span class="text-sm text-success font-medium animate-pulse"
            >{defaultSaveMessage}</span
          >
        {/if}
        <div
          class="flex items-center gap-3 bg-base-100 p-3 rounded-lg border border-base-content/10"
        >
          <span
            class="text-sm font-medium {projectDefaultIsLight
              ? 'opacity-50'
              : 'text-primary'}">Dark</span
          >
          <input
            type="checkbox"
            class="toggle toggle-primary"
            checked={projectDefaultIsLight}
            onchange={toggleProjectDefault}
          />
          <span
            class="text-sm font-medium {projectDefaultIsLight
              ? 'text-primary'
              : 'opacity-50'}">Light</span
          >
        </div>
      </div>
    </div>
  </section>

  <!-- Typography -->
  <section>
    <h2
      class="text-xl font-bold border-b border-base-content/10 pb-4 mb-8 uppercase tracking-wider opacity-70"
    >
      Typography
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div class="space-y-6">
        <div
          class="flex items-baseline justify-between border-b border-base-content/5 pb-2"
        >
          <h1 class="text-4xl">Heading 1</h1>
          <span class="text-xs font-mono opacity-50">.text-4xl</span>
        </div>
        <div
          class="flex items-baseline justify-between border-b border-base-content/5 pb-2"
        >
          <h2 class="text-3xl">Heading 2</h2>
          <span class="text-xs font-mono opacity-50">.text-3xl</span>
        </div>
        <div
          class="flex items-baseline justify-between border-b border-base-content/5 pb-2"
        >
          <h3 class="text-2xl">Heading 3</h3>
          <span class="text-xs font-mono opacity-50">.text-2xl</span>
        </div>
        <div
          class="flex items-baseline justify-between border-b border-base-content/5 pb-2"
        >
          <h4 class="text-xl">Heading 4</h4>
          <span class="text-xs font-mono opacity-50">.text-xl</span>
        </div>
        <div
          class="flex items-baseline justify-between border-b border-base-content/5 pb-2"
        >
          <h5 class="text-lg">Heading 5</h5>
          <span class="text-xs font-mono opacity-50">.text-lg</span>
        </div>
        <div
          class="flex items-baseline justify-between border-b border-base-content/5 pb-2"
        >
          <h6 class="text-base">Heading 6</h6>
          <span class="text-xs font-mono opacity-50">.text-base</span>
        </div>
      </div>
      <div class="space-y-4">
        <p class="text-base leading-relaxed">
          <strong class="text-primary block mb-1">Body Text</strong>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
        <p class="text-sm leading-relaxed">
          <strong class="text-primary block mb-1">Small Text (.text-sm)</strong>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
        <div class="pt-4 flex items-center flex-wrap gap-y-2">
          <a href="/styles" class="link mr-3">Default Link Color:</a>
          <div
            class="join bg-base-200 p-1 rounded-lg border border-base-content/10 mr-3"
          >
            <button
              class="join-item btn btn-xs {defaultLinkIsPrimary
                ? 'btn-ghost opacity-50'
                : 'btn-primary'}"
              onclick={() => {
                if (defaultLinkIsPrimary) toggleDefaultLinkColor()
              }}
            >
              Text Color
            </button>
            <button
              class="join-item btn btn-xs {defaultLinkIsPrimary
                ? 'btn-primary'
                : 'btn-ghost opacity-50'}"
              onclick={() => {
                if (!defaultLinkIsPrimary) toggleDefaultLinkColor()
              }}
            >
              Primary Color
            </button>
          </div>
          {#if linkSaveMessage}
            <span class="text-xs text-success font-medium animate-pulse"
              >{linkSaveMessage}</span
            >
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Colors (Interactive WYSIWYG) -->
  <section>
    <h2
      class="text-xl font-bold border-b border-base-content/10 pb-4 mb-8 uppercase tracking-wider opacity-70"
    >
      Color Palette (Interactive)
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      {#each colorDefs as color}
        <div class="card p-4 shadow-sm flex flex-col gap-3 relative group">
          <!-- Color Swatch & Picker -->
          <label
            for="color-picker-{color.key}"
            class="w-full h-24 rounded-lg shadow-inner cursor-pointer relative overflow-hidden transition-transform hover:scale-[1.02] block"
            style="background-color: var({color.key})"
          >
            <span class="sr-only">Color picker for {color.label}</span>
            <input
              type="color"
              id="color-picker-{color.key}"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={currentColors[color.key]}
              oninput={(e) => updateColor(color.key, e.currentTarget.value)}
            />
          </label>

          <!-- Details -->
          <div class="flex flex-col">
            <span class="font-bold text-lg">{color.label}</span>
            <span class="text-xs opacity-60 uppercase font-semibold"
              >{color.description}</span
            >
          </div>

          <!-- Hex Input -->
          <div class="form-control w-full">
            <label for="hex-input-{color.key}" class="sr-only"
              >Hex value for {color.label}</label
            >
            <input
              type="text"
              id="hex-input-{color.key}"
              class="input input-bordered input-xs w-full font-mono text-center opacity-80 focus:opacity-100"
              value={currentColors[color.key]}
              onchange={(e) => updateColor(color.key, e.currentTarget.value)}
            />
          </div>
        </div>
      {/each}
    </div>
  </section>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
    <!-- Buttons -->
    <section>
      <h2
        class="text-xl font-bold border-b border-base-content/10 pb-4 mb-8 uppercase tracking-wider opacity-70"
      >
        Interactive
      </h2>
      <div class="space-y-8">
        <div class="space-y-2">
          <p class="text-sm font-bold opacity-50 mb-2">Variants</p>
          <div class="flex flex-wrap gap-3">
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-secondary">Secondary</button>
            <button class="btn btn-accent">Accent</button>
            <button class="btn btn-neutral">Neutral</button>
            <button class="btn">Default</button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-bold opacity-50 mb-2">Styles & States</p>
          <div class="flex flex-wrap gap-3">
            <button class="btn btn-outline btn-primary">Outline</button>
            <button class="btn btn-ghost">Ghost</button>
            <button class="btn btn-link">Link</button>
            <button class="btn btn-primary" disabled>Disabled</button>
            <button class="btn btn-primary"
              ><span class="loading loading-spinner loading-xs"></span> Loading</button
            >
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-bold opacity-50 mb-2">Sizes</p>
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="btn btn-lg bg-base-200 border border-base-content/10 hover:bg-base-300"
              >Large</button
            >
            <button
              class="btn bg-base-200 border border-base-content/10 hover:bg-base-300"
              >Normal</button
            >
            <button
              class="btn btn-sm bg-base-200 border border-base-content/10 hover:bg-base-300"
              >Small</button
            >
            <button
              class="btn btn-xs bg-base-200 border border-base-content/10 hover:bg-base-300"
              >Tiny</button
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Inputs -->
    <section>
      <h2
        class="text-xl font-bold border-b border-base-content/10 pb-4 mb-8 uppercase tracking-wider opacity-70"
      >
        Inputs & Forms
      </h2>
      <div class="grid grid-cols-1 gap-6">
        <div class="form-control w-full">
          <label class="label" for="text-input-example"
            ><span class="label-text font-medium">Text Input</span></label
          >
          <input
            type="text"
            id="text-input-example"
            placeholder="Type here..."
            class="input input-bordered w-full"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-control w-full">
            <label class="label" for="select-example"
              ><span class="label-text font-medium">Select</span></label
            >
            <select id="select-example" class="select select-bordered w-full">
              <option disabled selected>Pick one</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>
          <div class="form-control w-full">
            <label class="label" for="file-input-example"
              ><span class="label-text font-medium">File Input</span></label
            >
            <input
              type="file"
              id="file-input-example"
              class="file-input file-input-bordered w-full"
            />
          </div>
        </div>

        <div
          class="flex flex-wrap gap-8 p-4 bg-base-200 rounded-box border border-base-content/10"
        >
          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked
                class="checkbox checkbox-primary"
              />
              <span class="label-text">Checkbox</span>
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="radio"
                name="radio-preview"
                class="radio radio-primary"
                checked
              />
              <span class="label-text">Radio</span>
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input type="checkbox" class="toggle toggle-primary" checked />
              <span class="label-text">Toggle</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- UI Elements -->
  <section>
    <h2
      class="text-xl font-bold border-b border-base-content/10 pb-4 mb-8 uppercase tracking-wider opacity-70"
    >
      Feedback & Cards
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div class="flex flex-col gap-4">
        <div role="alert" class="alert alert-info shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path></svg
          >
          <span><strong>Info:</strong> New software update available.</span>
        </div>
        <div role="alert" class="alert alert-success shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
          <span><strong>Success:</strong> Payment confirmed!</span>
        </div>
        <div role="alert" class="alert alert-warning shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            /></svg
          >
          <span><strong>Warning:</strong> Check your inputs.</span>
        </div>
        <div role="alert" class="alert alert-error shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            /></svg
          >
          <span><strong>Error:</strong> Something went wrong.</span>
        </div>
      </div>

      <div class="flex flex-col gap-8">
        <div class="flex gap-2 flex-wrap">
          <div class="badge badge-primary badge-lg">Primary</div>
          <div class="badge badge-secondary badge-lg">Secondary</div>
          <div class="badge badge-accent badge-lg">Accent</div>
          <div class="badge badge-outline badge-lg">Outline</div>
          <div class="badge badge-ghost badge-lg">Ghost</div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Card Component</h2>
            <p class="text-base-content/70">
              A standard card container for grouping related content and
              actions.
            </p>
            <div class="card-actions justify-end mt-4">
              <button class="btn btn-ghost btn-sm">Cancel</button>
              <button class="btn btn-primary btn-sm">Confirm Action</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
