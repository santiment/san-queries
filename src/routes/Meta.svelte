<script lang="ts">
  import { page } from '$app/state'

  const defaultTitle = 'Santiment Queries'
  const defaultDescription =
    'Crypto analysis tools to explore blockchain data. Exclusive on-chain, social and development metrics, low-latency market signals and daily market insights.'

  const meta = $derived(page.data.meta ?? {})
  const origin = $derived(page.url.origin)

  const { title, description, image = {} } = $derived(meta)
  const imageUrl = $derived(new URL(image.url, origin).href || '')
</script>

<svelte:head>
  <title>{title || defaultTitle}</title>

  <meta name="description" content={description || defaultDescription} />

  <meta property="og:title" content={title || defaultTitle} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:url" content="https://app.santiment.net/" />
  <meta property="og:site_name" content="Sanbase" />

  {#if image.url}
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:width" content={image.width || 1200} />
    <meta property="og:image:height" content={image.height || 678} />
    <meta property="og:image:secure" content={imageUrl} />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title || defaultTitle} />
  <meta name="twitter:description" content={description || defaultDescription} />
</svelte:head>
