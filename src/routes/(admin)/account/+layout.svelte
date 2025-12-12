<script lang="ts">
  // Firebase auth is handled on the server via session cookies
  // No client-side auth state listeners needed

  let { children } = $props()
</script>

{@render children?.()}
