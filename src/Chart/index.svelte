<script>
  import { themes } from 'studio/Chart/theme'
  import { getMetricNodes } from 'studio/Chart/nodes'
  import Chart from 'studio/Chart/index.svelte'
  import Lines from 'studio/Chart/Lines.svelte'
  import Axes from 'studio/Chart/Axes/index.svelte'
  import Tooltip from 'studio/Chart/Tooltip/index.svelte'
  import { FORMATTER } from 'studio/metrics/formatters'
  import { newChartColors } from 'studio/Chart/colors'

  export let columns
  export let data

  $: metrics = columns.map((column, i) => ({ key: i, node: 'line' }))

  $: theme = themes[0] // +$globals.isNightMode]
  $: chartData = data.map((v) => ({ ...v, datetime: v.id }))
  $: categories = getMetricNodes(metrics, {})

  $: colors = newChartColors(metrics)

  $: metricSettings = getTooltipSettings(columns)

  function getTooltipSettings(columns) {
    const metricSettings = {
      datetime: {
        formatter: (value) => {
          return value
        },
      },
    }

    columns.forEach((column, i) => {
      const { key, formatter = FORMATTER, title, axisFormatter } = column

      metricSettings[i] = Object.assign({
        label: title,
        formatter,
        axisFormatter,
      })
    })

    return metricSettings
  }

  $: axesMetricKeys = [0, 1]

  $: console.log(data, categories, colors, metricSettings)
</script>

<Chart data={chartData} {categories} {theme} {colors}>
  <Lines />

  <Axes {axesMetricKeys} {metricSettings} xTicks={10} />

  {#if process.browser}
    <Tooltip {axesMetricKeys} {metricSettings} isShiftForced />
  {/if}
</Chart>
