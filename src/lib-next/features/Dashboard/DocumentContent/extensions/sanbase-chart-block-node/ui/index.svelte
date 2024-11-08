<script lang="ts">
  import { BROWSER } from 'esm-env'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import Chart from '../Chart.svelte'
  import { useDataWidgetParameterOverrides } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
  import type { SANBASE_CHART_BLOCK_NODE } from '../schema'
  import type { TDataWidgetKey } from '$lib-next/features/Dashboard/types'
  import { useDashboardCtx } from '$lib-next/features/Dashboard/ctx'
  import type { TDataWidgetProps } from '../../schema/data-widget'
  // import { showWidgetSettingsDialog$ } from './WidgetSettingsDialog.svelte'

  let { view, data }: TDataWidgetProps<typeof SANBASE_CHART_BLOCK_NODE> = $props()

  const { dashboard } = useDashboardCtx.get()

  const localParameters = {
    from: 'utc_now-60d' as string,
    to: 'utc_now' as string,
    slug: 'bitcoin' as string,
  }
  const { parameterOverrides } = useDataWidgetParameterOverrides(data.id, localParameters)

  $inspect(parameterOverrides.$, data.id)

  // const showWidgetSettingsDialog = showWidgetSettingsDialog$()

  function setMetricsWidgetState(metrics: any[]) {
    view.$.updateAttributes({ 'data-metrics': metrics })
  }
</script>

<NodeViewWrapper style={view.$.node.attrs.style}>
  <div class="flex-1 rounded border column">
    {#if BROWSER}
      <Chart readonly={dashboard.isReadonly} {setMetricsWidgetState}></Chart>
    {/if}
  </div>
</NodeViewWrapper>
