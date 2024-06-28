<script lang="ts">
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import Svg from 'san-webkit-next/ui/core/Svg'

  import { useDashboardEditorCtx } from '$lib/DashboardNext/ctx'
  import { showSelectAssetDialog$ } from './SelectAssetDialog.svelte'
  import { showLinkParameterDialog$ } from './LinkParameterDialog.svelte'
  import { useAssetBySlug } from './assets.svelte'
  import { useParametersWidgetFlow } from '../parameters.svelte'

  let { view }: ViewProps = $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { getAsset } = useAssetBySlug()

  const state = useParametersWidgetFlow(view, { keyPrefix: 'Asset', defaultValue: 'bitcoin' })
  const asset = $derived(getAsset(state.$))

  const showLinkParameterDialog = showLinkParameterDialog$()
  const showSelectAssetDialog = showSelectAssetDialog$()

  function onAssetSelectorClick() {
    showSelectAssetDialog().then((asset) => {
      state.update(asset.slug)
    })
  }

  function onLinkParameterClick() {
    const parameter = state.parameter
    if (!parameter) return

    showLinkParameterDialog({ parameter }).then((changed) => {
      Object.assign(parameter, changed)

      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  }
</script>

<NodeViewWrapper class="ml-0.5 inline-flex center">
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

  {#if dashboardEditor.readonly === false}
    <button
      class="ml-2 cursor-pointer fill-waterloo hover:fill-green"
      onclick={onLinkParameterClick}
    >
      <Svg id="cog" w="12"></Svg>
    </button>
  {/if}
</NodeViewWrapper>
