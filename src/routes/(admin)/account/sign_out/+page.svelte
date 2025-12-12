<script lang="ts">
  import { goto } from "$app/navigation"
  import { onMount } from "svelte"

  let message = $state("Signing out....")

  // on mount, sign out via server
  onMount(async () => {
    try {
      const response = await fetch("/auth/session", {
        method: "DELETE",
      })
      if (response.ok) {
        goto("/")
      } else {
        message = "There was an issue signing out."
      }
    } catch {
      message = "There was an issue signing out."
    }
  })
</script>

<h1 class="text-2xl font-bold m-6 mx-auto my-auto">{message}</h1>
