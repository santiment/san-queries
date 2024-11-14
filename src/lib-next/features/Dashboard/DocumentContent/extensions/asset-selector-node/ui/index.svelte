<script lang="ts">
  import type { ASSET_SELECTOR_NODE } from '../schema'
  import type { TGlobalParametersWidgetProps } from '../../schema/global-parameter'

  import Svg from 'san-webkit-next/ui/core/Svg'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import { useParameterWidgetFlow } from '$lib-next/features/Dashboard/ctx/parameter-widgets.svelte'
  import { showSelectAssetDialog$ } from './SelectAssetDialog.svelte'
  import { useAssetFlow } from '../asset.svelte'
  import NodeSettings from '../../NodeSettings.svelte'
  import { showLinkParameterDialog$ } from '../../LinkParameterDialog.svelte'

  let { view, data }: TGlobalParametersWidgetProps<typeof ASSET_SELECTOR_NODE> = $props()

  const { getAssetBySlug } = useAssetFlow()

  const { globalParameter, update } = useParameterWidgetFlow(view, data.widget)
  const { outputs } = globalParameter

  const showSelectAssetDialog = showSelectAssetDialog$()
  const showLinkParameterDialog = showLinkParameterDialog$()

  let asset = $derived(getAssetBySlug(outputs.$$.slug))

  function onAssetSelectorClick() {
    showSelectAssetDialog().then((asset) => {
      update('slug', asset.slug)
    })
  }

  function onSettingsClick() {
    showLinkParameterDialog({ globalParameter })
  }
</script>

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

<NodeSettings onclick={onSettingsClick}></NodeSettings>
