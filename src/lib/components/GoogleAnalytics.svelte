<script lang="ts">
  import { env } from '$env/dynamic/public';
  
  const gaId = env.PUBLIC_GOOGLE_ANALYTICS_ID;
</script>

{#if gaId}
  <svelte:head>
    <script async src="https://www.googletagmanager.com/gtag/js?id={gaId}"></script>
    {@html `
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>
    `}
  </svelte:head>
{/if}
