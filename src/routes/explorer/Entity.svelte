<script lang="ts">
  import type { TEntity } from './api'

  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import Button from '$lib/ui/Button.svelte'
  import User from '$lib/ui/User/index.svelte'
  import Svg from '$lib/ui/Svg.svelte'

  let {
    type,
    item,
  }: {
    type: 'dashboard' | 'query'
    item: TEntity
  } = $props()
</script>

<article
  class="group relative flex justify-between rounded-lg border pb-4 pl-12 pr-6 pt-3 hover:bg-athens"
>
  <div class="flex flex-col gap-1">
    <h2 class="text-base font-medium group-hover:text-green">
      <a href="/{type}/{getSEOLinkFromIdAndTitle(item.id, item.name)}" class="link-as-bg"
        >{item.name}</a
      >
    </h2>
    <p class="mb-1 text-xs text-fiord">{item.description}</p>

    <User user={item.user} class="z-10 text-xs text-fiord"></User>

    <Svg id={type} w="12" class="absolute left-[26px] top-[18px] fill-rhino group-hover:fill-green"
    ></Svg>
  </div>

  <div class="flex gap-5 fill-waterloo text-waterloo">
    <Button icon="rocket" class="gap-1.5">{item.votes.totalVotes}</Button>

    {#if item.commentsCount !== undefined}
      <Button icon="comment" class="gap-1.5">{item.commentsCount}</Button>
    {/if}
  </div>
</article>
