<script lang="ts">
  // Use import.meta.env which has a fallback to empty string in vite.config.ts
  // This allows the app to work out of the box without requiring the env variable
  const gaId = import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID || ""
</script>

<svelte:head>
  {#if gaId}
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id={gaId}"
    ></script>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html `
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>
    `}
  {/if}
</svelte:head>
