<script lang="ts">
  import ToolsNav from "$lib/components/ToolsNav.svelte"
  import Calculator from "$lib/components/tools/Calculator.svelte"
  import Converter from "$lib/components/tools/Converter.svelte"
  import SignatureMaker from "$lib/components/tools/SignatureMaker.svelte"
  import { selectedTool } from "$lib/stores/toolsStore"
</script>

<div class="drawer lg:drawer-open h-screen">
  <input id="tools-drawer" type="checkbox" class="drawer-toggle" />

  <!-- Main Content Area -->
  <div class="drawer-content flex flex-col h-full overflow-hidden bg-base-100">
    <!-- Mobile Header with Hamburger -->
    <div
      class="w-full navbar bg-base-100 lg:hidden border-b border-base-200 flex-shrink-0"
    >
      <div class="flex-none">
        <label
          for="tools-drawer"
          aria-label="open sidebar"
          class="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path></svg
          >
        </label>
      </div>
      <div class="flex-1 px-2 mx-2 font-bold text-lg">Tools Hub</div>
    </div>

    <!-- Tool Content -->
    <div class="flex-1 overflow-auto p-4 lg:p-0">
      {#if $selectedTool === "calculator"}
        <Calculator />
      {:else if $selectedTool === "converter"}
        <Converter />
      {:else if $selectedTool === "signature"}
        <SignatureMaker />
      {:else}
        <div class="flex items-center justify-center h-full">
          <p class="text-base-content/50">Select a tool from the sidebar</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Sidebar -->
  <div class="drawer-side z-20">
    <label for="tools-drawer" aria-label="close sidebar" class="drawer-overlay"
    ></label>
    <div class="h-full w-80 bg-base-200">
      <ToolsNav />
    </div>
  </div>
</div>
