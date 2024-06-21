<script lang="ts">
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import Svg from 'san-webkit-next/ui/core/Svg'

  import { useDashboardEditorCtx } from '$lib/DashboardNext/ctx'
  import { useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
  import {
    useAssetBySlug,
    useLinkParametersFlow,
    useParameterInitFlow,
    useSelectAssetFlow,
  } from './flow.svelte'
  import { untrack } from 'svelte'

  let { view }: ViewProps = $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { globalParameterByKey } = useGlobalParametersCtx()
  const { getAsset } = useAssetBySlug()

  let attrs = $derived(view.$.node.attrs)
  let parameter = $derived(globalParameterByKey.$.get(attrs['data-id']))
  let asset = $derived(getAsset(attrs['data-slug']))

  $inspect(parameter, attrs, globalParameterByKey.$)

  useParameterInitFlow(attrs)
  const { onAssetSelectorClick } = useSelectAssetFlow(view)
  const { onLinkParameterClick } = useLinkParametersFlow()

  $effect(() => {
    const slug = attrs['data-slug']

    if (!parameter || parameter.value === slug) return

    untrack(() => {
      parameter.value = slug
      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  })
</script>

<NodeViewWrapper class="ml-0.5 inline-flex center">
  <button
    class="flex cursor-pointer gap-1 rounded border px-1.5 center hover:border-green"
    onclick={() => onAssetSelectorClick(parameter)}
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
      onclick={() => onLinkParameterClick(parameter)}
    >
      <Svg id="cog" w="12"></Svg>
    </button>
  {/if}
</NodeViewWrapper>
