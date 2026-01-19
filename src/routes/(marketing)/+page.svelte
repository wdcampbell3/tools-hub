<script lang="ts">
  import { tools } from "$lib/stores/toolsStore"
</script>

<div class="min-h-screen bg-base-100">
  <!-- Hero Section -->
  <div class="bg-primary text-primary-content py-20 px-4 text-center">
    <h1 class="text-5xl font-bold mb-4">Dougie's Tool Hub</h1>
    <p class="text-xl italic opacity-90 mb-8">
      Vibe Coded—100% AI Chat-Prompted—Tool Experiments!
    </p>
    <p class="text-sm opacity-75">
      This project is open source and great for beginners.
    </p>
  </div>

  <!-- Tools Grid -->
  <div class="max-w-6xl mx-auto py-16 px-4">
    <h2 class="text-4xl font-bold text-primary text-center mb-2">Our Tools</h2>
    <p class="text-center text-base-content/60 mb-12">
      Pick a tool... and start vibing!
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each tools as tool}
        <a
          href="/tools/{tool.id}"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200 group"
        >
          <figure
            class="px-8 pt-8 pb-4 h-48 flex items-center justify-center bg-base-200/50 group-hover:bg-primary/5 transition-colors"
          >
            <span class="text-8xl">{tool.icon}</span>
          </figure>
          <div class="card-body">
            <h2
              class="card-title text-primary group-hover:text-secondary transition-colors"
            >
              {tool.name}
            </h2>
            <p class="text-base-content/70">{tool.description}</p>
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>
