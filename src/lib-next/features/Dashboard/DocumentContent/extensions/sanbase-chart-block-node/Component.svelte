<script lang="ts">
  import { BROWSER } from 'esm-env'
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import Button from 'san-webkit-next/ui/core/Button'
  import Chart from './Chart.svelte'
  import { useDataWidgetParameterOverrides } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
  import { SANBASE_CHART_BLOCK_NODE } from './schema'
  import type { TDataWidgetKey } from '$lib-next/features/Dashboard/types'
  import { useDashboardCtx } from '$lib-next/features/Dashboard/ctx'
  // import { showWidgetSettingsDialog$ } from './WidgetSettingsDialog.svelte'

  let { view }: ViewProps = $props()

  const { dashboard } = useDashboardCtx.get()

  const id = view.$.node.attrs['data-id'] as TDataWidgetKey

  const { parameterOverrides } = useDataWidgetParameterOverrides(
    id,
    SANBASE_CHART_BLOCK_NODE.localParameters,
  )

  $inspect(parameterOverrides.$, id)

  // const showWidgetSettingsDialog = showWidgetSettingsDialog$()

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
      <Chart readonly={dashboard.isReadonly} {setMetricsWidgetState}></Chart>
    {/if}
  </div>
</NodeViewWrapper>
