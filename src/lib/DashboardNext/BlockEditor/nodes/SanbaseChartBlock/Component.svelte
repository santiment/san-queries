<script lang="ts">
  import { BROWSER } from 'esm-env'
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import { useDashboardEditorCtx, useQueryColumnActionsCtx } from '$lib/DashboardNext/ctx'
  import Button from 'san-webkit-next/ui/core/Button'
  import Chart from './Chart.svelte'
  import { showWidgetSettingsDialog$ } from './WidgetSettingsDialog.svelte'

  let { view }: ViewProps = $props()
  let attrs = $derived(view.$.node.attrs)

  let assetParameterId: undefined | string = $derived(view.$.node.attrs['data-asset-parameter'])
  let fromParameterId: undefined | string = $derived(view.$.node.attrs['data-from-parameter'])
  let toParameterId: undefined | string = $derived(view.$.node.attrs['data-to-parameter'])

  const { dashboardEditor } = useDashboardEditorCtx()

  const showWidgetSettingsDialog = showWidgetSettingsDialog$()

  function onLinkParameterClick() {
    showWidgetSettingsDialog({ view })
  }

  $effect(() => {})

  function setMetricsWidgetState(metrics: any[]) {
    view.$.updateAttributes({ 'data-metrics': metrics })
  }
</script>

<NodeViewWrapper
  class="relative my-2 flex max-h-[1000px] min-h-[450px]"
  style={view.$.node.attrs.style}
>
  <div class="flex-1 rounded border column">
    {#if BROWSER}
      <Chart
        readonly={false}
        {assetParameterId}
        {fromParameterId}
        {toParameterId}
        {setMetricsWidgetState}
      ></Chart>
    {/if}
  </div>

  {#if dashboardEditor.readonly === false}
    <button
      class="ml-2 cursor-pointer self-start fill-waterloo hover:fill-green"
      onclick={onLinkParameterClick}
    >
      <Svg id="cog" w="12"></Svg>
    </button>
  {/if}
</NodeViewWrapper>
