<script lang="ts">
  import { PUBLIC_GOOGLE_ANALYTICS_ID } from '$env/static/public';
  
  const gaId = PUBLIC_GOOGLE_ANALYTICS_ID;
</script>

<svelte:head>
  {#if gaId}
    <script async src="https://www.googletagmanager.com/gtag/js?id={gaId}"></script>
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
