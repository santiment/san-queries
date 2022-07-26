<script>
  import { newChartColors, newHighlightedColors } from 'studio/Chart/colors'
  import { downloadPng } from '@/Result/downloadPng'
  import Chart from './Chart.svelte'
  import Metrics from './Metrics.svelte'

  export let columns
  export let dateColumns
  export let data
  export let xAxisKey = [...dateColumns][0]

  let chart

  $: metrics = columns
    .filter(({ id }) => !dateColumns.has(id))
    .map(({ id, title, formatter, chartStyle }) => ({
      key: id.toString(),
      label: title,
      node: chartStyle || 'line',
      formatter,
    }))

  $: chartData = data
    .map((row) => ({ ...row, datetime: Date.parse(row[xAxisKey]) }))
    .sort(datetimeSorter)
  $: rawColors = newChartColors(metrics)
  $: colors = rawColors

  $: axesMetricKeys = metrics.map(({ key }) => key)

  function onMetricHover(metric) {
    console.log(metric)
    colors = metric ? newHighlightedColors(rawColors, metric) : rawColors
  }

  function datetimeSorter(a, b) {
    return a.datetime - b.datetime
  }

  export function download(title) {
    downloadPng(chart, metrics, title)
  }
</script>

<Metrics {metrics} {colors} {onMetricHover} />

<Chart
  data={chartData}
  {metrics}
  {colors}
  {axesMetricKeys}
  onChart={(_chart) => (chart = _chart)} />
