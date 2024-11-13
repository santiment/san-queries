<script lang="ts">
  import type { TSeries } from 'san-webkit-next/ui/app/Chart/ctx'
  import type { SANBASE_CHART_BLOCK_NODE } from '../schema'
  import type { TDataWidgetProps } from '../../schema/data-widget'

  import { BROWSER } from 'esm-env'
  import Chart, { Tooltip, ApiMetricSeries } from 'san-webkit-next/ui/app/Chart'
  import Button from 'san-webkit-next/ui/core/Button'
  import { useDashboardCtx } from '$lib-next/features/Dashboard/ctx'
  import { useSanbaseChartWidgetFlow } from '../ctx'
  import { showMetricsDialogDialog$ } from './__MetricsDialog/MetricsDialog.svelte'

  let { view, data }: TDataWidgetProps<typeof SANBASE_CHART_BLOCK_NODE> = $props()

  const { dashboard } = useDashboardCtx.get()
  const { metricSeries, chartParameters, normalizeMetric } = useSanbaseChartWidgetFlow(data.widget)

  const showMetricsDialogDialog = showMetricsDialogDialog$()

  function onMetricDeleteClick(item: TSeries) {
    metricSeries.delete(item)
  }

  function onAddMetricClick() {
    const currentMetrics = metricSeries.$.map((item) => item.apiMetricName)
    const slug = chartParameters.$$.selector.slug!

    showMetricsDialogDialog({
      slug,
      metrics: currentMetrics,
      onApply: onNewMetricsApply,
    })
  }

  function onNewMetricsApply(metrics: string[]) {
    const current = new Set(metricSeries.$.map((item) => item.apiMetricName))

    const applied = new Set(metrics)
    const deleted = new Set(
      metricSeries.$.filter((item) => applied.has(item.apiMetricName) === false),
    )

    for (const metric of deleted) {
      metricSeries.delete(metric)
    }

    for (const metric of metrics) {
      if (current.has(metric)) continue

      metricSeries.add(normalizeMetric({ name: metric }))
    }
  }
</script>

<div class="flex-1 rounded border column">
  <div class="flex flex-wrap items-center gap-2 p-2">
    {#each metricSeries.$ as item (item.id)}
      <div class="relative flex min-h-8 rounded-r border px-2 center" style:--color={item.color.$}>
        <span class="color absolute"></span>
        {item.label}

        {#if dashboard.isEditable}
          <Button icon="close" iconSize={8} onclick={() => onMetricDeleteClick(item)}></Button>
        {/if}
      </div>
    {/each}

    {#if dashboard.isEditable}
      <Button variant="border" onclick={onAddMetricClick}>Add metric</Button>

      <Button
        class="ml-auto"
        explanation="Remove widget"
        icon="close"
        iconSize={12}
        onclick={() => {
          view.$.deleteNode()
          view.$.editor.commands.focus()
        }}
      ></Button>
    {/if}
  </div>

  {#if BROWSER}
    <Chart class="flex-1 bg-white" options={{ handleScroll: false, handleScale: false }}>
      {#each metricSeries.$ as item (item.id)}
        <ApiMetricSeries series={item}></ApiMetricSeries>
      {/each}

      <Tooltip></Tooltip>
    </Chart>
  {/if}
</div>

<style>
  .color {
    top: -1px;
    bottom: -1px;
    left: -1px;
    width: 2px;
    background: var(--color);
  }
</style>
