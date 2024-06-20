<script lang="ts">
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import Svg from 'san-webkit-next/ui/core/Svg'

  import { useDashboardEditorCtx } from '$lib/DashboardNext/ctx'
  import { useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
  import { useAssetBySlug, useParameterInitFlow } from './flow.svelte'

  let { view }: ViewProps = $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { globalParameters, globalParameterByKey } = useGlobalParametersCtx()
  const { getAsset } = useAssetBySlug()

  let attrs = $derived(view.$.node.attrs)
  let parameter = $derived(globalParameterByKey.$.get(attrs['data-id']))
  let asset = $derived(getAsset(attrs['data-slug']))

  $inspect(parameter, asset)

  useParameterInitFlow(attrs)

  function onAssetClick() {}

  function onLinkParameterClick() {}
</script>

<NodeViewWrapper class="ml-0.5 inline-flex center">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <button
    class="flex cursor-pointer gap-1 rounded border px-1.5 center hover:border-green"
    onclick={onAssetClick}
  >
    <AssetLogo slug={asset.slug}></AssetLogo>

    <span class="capitalize">{asset.name || asset.slug}</span>
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
