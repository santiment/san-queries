<script lang="ts">
  import { BROWSER } from 'esm-env'
  import Button from 'san-webkit-next/ui/core/Button'
  import Chart, { Tooltip, ApiMetricSeries } from 'san-webkit-next/ui/app/Chart'
  import {
    useColorGenerator,
    useChartGlobalParametersCtx,
    useMetricSeriesCtx,
  } from 'san-webkit-next/ui/app/Chart/ctx'
  // import { showMetricsDialogDialog$ } from './__MetricsDialog/MetricsDialog.svelte'
  import { useGlobalParametersCtx as useDashboardGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'

  type TProps = {
    readonly: boolean
    setMetricsWidgetState: (metrics: string[]) => void
  }
  let { readonly = true, setMetricsWidgetState }: TProps = $props()

  // const { globalParameterByKey } = useDashboardGlobalParametersCtx()
  let assetParameter = $derived(undefined)
  let fromParameter = $derived(undefined)
  let toParameter = $derived(undefined)

  const { colorGenerator } = useColorGenerator()
  const { metricSeries } = useMetricSeriesCtx.get()

  // const showMetricsDialogDialog = showMetricsDialogDialog$()

  function onAddMetricClick() {
    // showMetricsDialogDialog({
    //   slug: assetParameter || 'bitcoin',
    //   metrics: [],
    //   onApply(metrics) {
    //     const selected = new Set(metricSeries.$.map((metric) => metric.apiMetricName))
    //     for (const metric of metrics) {
    //       if (selected.has(metric.key)) continue
    //       metricSeries.add({
    //         name: metric.key,
    //         label: metric.label,
    //         style: 'line',
    //         color: colorGenerator.new(),
    //         scaleId: 'right-' + metric.key,
    //       })
    //     }
    //     setMetricsWidgetState(metricSeries.$.map((v) => v.apiMetricName))
    //   },
    // })
  }

  function onMetricDeleteClick(series: TSeries) {
    metricSeries.delete(series)

    setMetricsWidgetState(metricSeries.$.map((v) => v.apiMetricName))
  }
</script>

<div class="flex flex-wrap items-center gap-2 p-2">
  {#each metricSeries.$ as item (item.id)}
    <div class="relative flex min-h-8 rounded-r border px-2 center" style:--color={item.color.$}>
      <span class="color absolute"></span>
      {item.label}

      {#if readonly === false}
        <Button icon="close" iconSize={8} onclick={() => onMetricDeleteClick(item)}></Button>
      {/if}
    </div>
  {/each}

  {#if readonly === false}
    <Button variant="border" onclick={onAddMetricClick}>Add metric</Button>
  {/if}
</div>

<Chart class="flex-1 bg-white">
  {#each metricSeries.$ as item (item.id)}
    {console.log(item)}
    <ApiMetricSeries series={item}></ApiMetricSeries>
  {/each}

  <Tooltip></Tooltip>
</Chart>

<style>
  .color {
    top: -1px;
    bottom: -1px;
    left: -1px;
    width: 2px;
    background: var(--color);
  }
</style>
