<script lang="ts">
  import ToolsNav from '$lib/components/ToolsNav.svelte';
  import Calculator from '$lib/components/tools/Calculator.svelte';
  import Converter from '$lib/components/tools/Converter.svelte';
  import { selectedTool } from '$lib/stores/toolsStore';
</script>

<div class="flex h-screen overflow-hidden">
  <!-- Left Navigation -->
  <div class="w-80 flex-shrink-0">
    <ToolsNav />
  </div>

  <!-- Main Content Area -->
  <div class="flex-1 overflow-auto bg-base-100">
    {#if $selectedTool === 'calculator'}
      <Calculator />
    {:else if $selectedTool === 'converter'}
      <Converter />
    {:else}
      <div class="flex items-center justify-center h-full">
        <p class="text-base-content/50">Select a tool from the sidebar</p>
      </div>
    {/if}
  </div>
</div>
