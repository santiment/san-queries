<script lang="ts">
  import type { SS } from 'svelte-runes'

  import Metric from '$lib/l__Chart/Metric.svelte'
  import Chart from '$lib/l__Chart/index.svelte'
  import { useChartVisualizationCtx } from './ctx.svelte'

  let {
    class: className,
    sqlData,
    settings,
  }: {
    class?: string
    sqlData: App.SqlData
    settings: SS<Record<string, any>>
  } = $props()

  const { ctx } = useChartVisualizationCtx(sqlData, settings)

  let data = $derived(getData(sqlData, ctx.$.dateColumn))

  function getData({ rows }: App.SqlData, dateColumn: string) {
    return rows
      .slice()
      .map((row) => {
        return Object.assign({}, row, { [dateColumn]: Date.parse(row[+dateColumn] as string) })
      })
      .sort((a, b) => a[dateColumn] - b[dateColumn])
  }
</script>

<metrics class="flex w-full flex-wrap gap-2 p-2">
  {#each ctx.$.metrics as metric}
    <Metric {metric} />
  {/each}
</metrics>

<Chart class={className} {data} metrics={ctx.$.metrics} xAxisKey={ctx.$.dateColumn} />
