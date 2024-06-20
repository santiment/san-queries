<script context="module">
  import Component from './SelectAssetDialog.svelte'

  export const showSelectAssetDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import Dialog, {
    dialogs$,
    type TDialogReject,
    type TDialogResolve,
  } from '$lib/san-webkit-next/ui/core/Dialog'
  import { queryAllProjects } from 'san-studio/lib/api/project'
  import { ss } from 'svelte-runes'
  import { untrack } from 'svelte'
  import VirtualList from '$lib/san-webkit-next/ui/app/VirtualList'
  import Svg from '$lib/ui/Svg.svelte'
  import AssetLogo from '$lib/san-webkit-next/ui/app/AssetLogo'

  let { resolve, reject, Controller }: { resolve: TDialogResolve<boolean>; reject: TDialogReject } =
    $props()

  let assets = ss([])
  let searchTerm = $state('')

  let filtered = $derived(assets.$.filter((item) => item.name.toLowerCase().includes(searchTerm)))

  function onAssetClick(asset) {
    resolve(asset)
    Controller.close()
  }

  $effect(() =>
    untrack(() => {
      queryAllProjects().then((data) => {
        assets.$ = data
      })
    }),
  )
</script>

<Dialog class="max-h-[480px] w-[500px] rounded-lg">
  <div class="flex text-nowrap fill-waterloo center">
    <Svg id="search" w="16" class="absolute left-5 top-5" />
    <input
      bind:value={searchTerm}
      autofocus
      class="w-full rounded-lg p-4 pl-12 text-base outline-none"
      type="text"
      placeholder="Search for asset or address..."
    />
  </div>
  <VirtualList class="min-h-[300px] flex-1 px-6" data={filtered} getKey={(item) => item.slug}>
    {#snippet children({ item })}
      <div
        class="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded p-2 hover:bg-athens"
        onclick={() => onAssetClick(item)}
      >
        <AssetLogo class="size-8" slug={item.slug}></AssetLogo>
        <span>
          {item.name}
        </span>
        <span class="text-waterloo">({item.ticker})</span>
      </div>
    {/snippet}
  </VirtualList>
</Dialog>
