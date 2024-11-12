<script lang="ts">
  import { BROWSER } from 'esm-env'
  import { useDataWidgetParameterOverrides } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
  import { useDashboardCtx } from '$lib-next/features/Dashboard/ctx'
  import Chart from './Chart.svelte'
  import type { SANBASE_CHART_BLOCK_NODE } from '../schema'
  import type { TDataWidgetProps } from '../../schema/data-widget'
  import { useMetricSeriesCtx } from 'san-webkit-next/ui/app/Chart/ctx'
  import { useSanbaseChartWidgetFlow } from '../ctx'
  // import { showWidgetSettingsDialog$ } from './WidgetSettingsDialog.svelte'

  let { data }: TDataWidgetProps<typeof SANBASE_CHART_BLOCK_NODE> = $props()

  const { dashboard } = useDashboardCtx.get()
  const {} = useSanbaseChartWidgetFlow(data.widget)

  function setMetricsWidgetState(metrics: any[]) {
    // view.$.updateAttributes({ metrics })
  }
</script>

<div class="flex-1 rounded border column">
  {#if BROWSER}
    <Chart readonly={dashboard.isReadonly} {setMetricsWidgetState}></Chart>
  {/if}
</div>
