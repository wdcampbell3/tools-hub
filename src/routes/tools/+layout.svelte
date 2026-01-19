<script lang="ts">
  import { page } from "$app/stores"
  import { tools } from "$lib/stores/toolsStore"
  import ThemeToggle from "$lib/components/ThemeToggle.svelte"

  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()
</script>

<div class="drawer lg:drawer-open">
  <input id="tools-drawer" type="checkbox" class="drawer-toggle" />

  <div
    class="drawer-content flex flex-col h-[100dvh] bg-base-100 overflow-hidden"
  >
    <!-- Mobile Header -->
    <div
      class="w-full navbar bg-base-100 lg:hidden border-b border-base-200 flex-none z-10"
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

    <!-- Page Content -->
    <main class="flex-1 flex flex-col relative overflow-hidden">
      {@render children?.()}
    </main>
  </div>

  <!-- Sidebar -->
  <div class="drawer-side z-20">
    <label for="tools-drawer" aria-label="close sidebar" class="drawer-overlay"
    ></label>
    <div
      class="p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col gap-2"
    >
      <!-- Sidebar Header -->
      <div class="mb-4 flex items-center justify-between px-2">
        <a
          href="/"
          class="flex-1 px-2 py-2 text-xl font-bold text-base-content hover:bg-base-300 rounded-lg"
        >
          🏠 Tools Hub
        </a>
        <div class="ml-2">
          <ThemeToggle inline={true} />
        </div>
      </div>

      <ul class="menu p-0 gap-2">
        {#each tools as tool}
          <li>
            <a
              href="/tools/{tool.id}"
              class={$page.url.pathname.includes(tool.id)
                ? "bg-primary !text-white font-bold shadow-md"
                : "hover:bg-base-300 text-base-content"}
            >
              <span class="text-2xl">{tool.icon}</span>
              <span class="font-medium">{tool.name}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
