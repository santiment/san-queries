<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import { showSelectAssetDialog$ } from './SelectAssetDialog.svelte'
  import { useAssetFlow } from './asset.svelte'

  let { view }: ViewProps = $props()

  const { getAssetBySlug } = useAssetFlow()

  const showSelectAssetDialog = showSelectAssetDialog$()

  console.log(view)
  let asset = $derived(getAssetBySlug('bitcoin'))

  function onAssetSelectorClick() {
    showSelectAssetDialog().then((asset) => {
      console.log(asset)
      // state.update(asset.slug)
    })
  }
</script>

<NodeViewWrapper class="relative inline-flex px-[1px]">
  <button
    class="flex cursor-pointer gap-1 whitespace-nowrap rounded border px-1.5 center hover:border-green"
    onclick={onAssetSelectorClick}
  >
    <AssetLogo slug={asset.slug}></AssetLogo>
    <span class="overflow-hidden text-ellipsis capitalize">{asset.name || asset.slug}</span>
    {#if asset.ticker}
      <span class="uppercase text-waterloo">({asset.ticker})</span>
    {/if}

    <Svg id="arrow-down" w="8" class="ml-1.5"></Svg>
  </button>
</NodeViewWrapper>
