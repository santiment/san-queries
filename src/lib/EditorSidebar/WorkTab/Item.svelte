<script lang="ts">
  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import Button from '$lib/ui/Button.svelte'
  import Svg from '$lib/ui/Svg.svelte'
  import { cn } from '$lib/ui/utils'

  let {
    item,
    isActive = false,
  }: { isActive?: boolean; item: { id: number; type: 'dashboard' | 'query'; name: string } } =
    $props()

  let href = $derived(`/${item.type}/${getSEOLinkFromIdAndTitle(item.id, item.name)}`)
</script>

<article
  class={cn(
    'group/item relative flex items-center gap-2 rounded px-2.5 py-1.5 hover:bg-white',
    isActive && 'bg-white',
  )}
>
  <Svg id={item.type} w="12"></Svg>
  <a {href} class="link-as-bg single-line flex-1">
    {item.name}
  </a>

  <actions class="relative z-[1] -my-1.5 -mr-2.5 hidden group-hover/item:flex">
    <Button
      {href}
      target="_blank"
      explanation="Open in a new tab"
      icon="external-link"
      iconSize="12"
    ></Button>
  </actions>
</article>

<style>
  actions {
    --expl-right: 0;
    --expl-left: unset;
  }
</style>
