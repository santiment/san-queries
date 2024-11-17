<script lang="ts">
  import type { ASSET_SELECTOR_NODE } from '../schema'
  import type { TParameterWidgetProps } from '../../schema/parameter-widget'

  import Svg from 'san-webkit-next/ui/core/Svg'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import { useAssetsCtx } from 'san-webkit-next/ctx/assets'
  import { capitalize } from 'san-webkit/lib/utils/formatting'
  import { useParameterWidgetFlow } from '$lib-next/dashboard/ctx/parameter-widgets.svelte'
  import { showSelectAssetDialog$ } from './SelectAssetDialog.svelte'
  import { showSettingsDialog$ } from './SettingsDialog.svelte'
  import NodeSettings from '../../NodeSettings.svelte'

  let { view, data }: TParameterWidgetProps<typeof ASSET_SELECTOR_NODE> = $props()

  const { getAssetBySlug } = useAssetsCtx()

  const { globalParameter, update } = useParameterWidgetFlow(view, data.widget)
  const { outputs, settings } = globalParameter

  const showSelectAssetDialog = showSelectAssetDialog$()
  const showSettingsDialog = showSettingsDialog$()

  const slug = $derived(outputs.$$.slug)
  const asset = $derived(getAssetBySlug(slug) || { slug, ticker: '', name: capitalize(slug) })

  function onAssetSelectorClick() {
    showSelectAssetDialog({
      slugsByText: settings.$$.slugsByText,
    }).then((asset) => {
      update('slug', asset.slug)
    })
  }

  function onSettingsClick() {
    showSettingsDialog({ globalParameter })
  }
</script>

<button
  class="ml-0.5 flex cursor-pointer gap-1 whitespace-nowrap rounded border px-1.5 center hover:border-green"
  onclick={onAssetSelectorClick}
>
  <AssetLogo slug={asset.slug || ''}></AssetLogo>
  <span class="overflow-hidden text-ellipsis">{asset.name || asset.slug}</span>
  {#if asset.ticker}
    <span class="uppercase text-waterloo">({asset.ticker})</span>
  {/if}

  <Svg id="arrow-down" w="8" class="ml-1.5"></Svg>
</button>

<NodeSettings onclick={onSettingsClick}></NodeSettings>
