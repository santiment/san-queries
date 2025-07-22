<script lang="ts">
  import { PaneMetric } from 'san-webkit-next/ui/app/Chart/PaneLegend'
  import {
    useChartCtx,
    useColorGenerator,
    useMetricSeriesCtx,
  } from 'san-webkit-next/ui/app/Chart/ctx'

  import Chart from './Chart.svelte'
  import { normalizeMetric } from './utils.js'

  let { metrics } = $props()

  useChartCtx.set()
  const { colorGenerator } = useColorGenerator()

  useMetricSeriesCtx.set(metrics.map((item: any) => normalizeMetric(item, colorGenerator)))
</script>

<Chart class="h-[800px] min-h-[600px] border-none">
  {#snippet paneLegend({ metrics })}
    {#each metrics as metric (metric.id)}
      <PaneMetric {metric}></PaneMetric>
    {/each}
  {/snippet}
</Chart>
