<script>
  import { getMetricNodes } from 'studio/Chart/nodes'
  import Chart from './Chart.svelte'
  import { newChartColors, newHighlightedColors } from 'studio/Chart/colors'
  import Metrics from './Metrics.svelte'

  export let columns
  export let data

  $: metrics = columns.map((column, i) => ({
    key: i.toString(),
    label: column.title,
    node: 'line',
  }))

  $: chartData = data.map((v) => ({ ...v, datetime: v.id }))
  $: categories = getMetricNodes(metrics, {})

  $: rawColors = newChartColors(metrics)
  $: colors = rawColors

  $: console.log(data, categories, colors)

  function onMetricHover(metric) {
    console.log(metric)
    colors = metric ? newHighlightedColors(rawColors, metric) : rawColors
  }
</script>

<Metrics {metrics} {colors} {onMetricHover} />

<Chart data={chartData} {metrics} {colors} />
