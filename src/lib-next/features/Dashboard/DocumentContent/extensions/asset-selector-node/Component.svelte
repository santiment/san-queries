<script lang="ts">
  import type { ASSET_SELECTOR_NODE } from './schema'
  import type { TGlobalParametersWidgetProps } from '../schema/global-parameter'

  import Svg from 'san-webkit-next/ui/core/Svg'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import { NodeViewWrapper } from 'tiptap-svelte-adapter'
  import { useGlobalParameterWidgetFlow } from '$lib-next/features/Dashboard/ctx/global-parameters.svelte'
  import { showSelectAssetDialog$ } from './SelectAssetDialog.svelte'
  import { useAssetFlow } from './asset.svelte'

  let { view, data }: TGlobalParametersWidgetProps<typeof ASSET_SELECTOR_NODE> = $props()

  const { getAssetBySlug } = useAssetFlow()

  const { globalParameter, update } = useGlobalParameterWidgetFlow(view, data.widget)
  const { state } = globalParameter

  const showSelectAssetDialog = showSelectAssetDialog$()

  let asset = $derived(getAssetBySlug(state.$$.slug))

  function onAssetSelectorClick() {
    showSelectAssetDialog().then((asset) => {
      update('slug', asset.slug)
    })
  }
</script>

<NodeViewWrapper class="relative inline-flex px-[1px]">
  <button
    class="flex cursor-pointer gap-1 whitespace-nowrap rounded border px-1.5 center hover:border-green"
    onclick={onAssetSelectorClick}
  >
    <AssetLogo slug={asset.slug || ''}></AssetLogo>
    <span class="overflow-hidden text-ellipsis capitalize">{asset.name || asset.slug}</span>
    {#if asset.ticker}
      <span class="uppercase text-waterloo">({asset.ticker})</span>
    {/if}

    <Svg id="arrow-down" w="8" class="ml-1.5"></Svg>
  </button>
</NodeViewWrapper>
