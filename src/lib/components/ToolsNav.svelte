<script lang="ts">
  import { selectedTool, tools } from "$lib/stores/toolsStore"

  function selectTool(toolId: string) {
    selectedTool.set(toolId)
  }
</script>

<div class="h-full bg-base-200 border-r border-base-300 flex flex-col">
  <!-- Header -->
  <div class="p-6 border-b border-base-300">
    <h1 class="text-2xl font-bold text-base-content">Tools Hub</h1>
    <p class="text-sm text-base-content/60 mt-1">
      Select a tool to get started
    </p>
  </div>

  <!-- Tools List -->
  <nav class="flex-1 overflow-y-auto p-4">
    <ul class="menu gap-2">
      {#each tools as tool}
        <li>
          <button
            class="flex items-center gap-3 w-full rounded-lg transition-all {$selectedTool ===
            tool.id
              ? 'bg-primary text-primary-content font-semibold'
              : 'hover:bg-base-300'}"
            onclick={() => selectTool(tool.id)}
          >
            <span class="text-2xl">{tool.icon}</span>
            <div class="text-left">
              <div class="font-medium">{tool.name}</div>
              <div class="text-xs opacity-70">{tool.description}</div>
            </div>
          </button>
        </li>
      {/each}
    </ul>
  </nav>
</div>
