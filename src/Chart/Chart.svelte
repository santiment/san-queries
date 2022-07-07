<script>
  import { themes } from 'studio/Chart/theme'
  import { getMetricNodes } from 'studio/Chart/nodes'
  import Chart from 'studio/Chart/index.svelte'
  import Lines from 'studio/Chart/Lines.svelte'
  import Axes from 'studio/Chart/Axes/index.svelte'
  import Tooltip from 'studio/Chart/Tooltip/index.svelte'
  import { FORMATTER } from 'studio/metrics/formatters'

  export let data
  export let metrics
  export let colors

  $: theme = themes[0] // +$globals.isNightMode]
  $: chartData = data.map((v) => ({ ...v, datetime: v.id }))
  $: categories = getMetricNodes(metrics, {})
  $: metricSettings = getTooltipSettings(metrics)

  function getTooltipSettings(metrics) {
    const metricSettings = {
      datetime: {
        formatter: (value) => {
          return value
        },
      },
    }

    metrics.forEach((column, i) => {
      const { key, formatter = FORMATTER, label, axisFormatter } = column

      metricSettings[i] = Object.assign({
        label,
        formatter,
        axisFormatter,
      })
    })

    return metricSettings
  }

  $: axesMetricKeys = [0, 1]
</script>

<Chart data={chartData} {categories} {theme} {colors}>
  <Lines />

  <Axes {axesMetricKeys} {metricSettings} xTicks={10} />

  {#if process.browser}
    <Tooltip {axesMetricKeys} {metricSettings} isShiftForced />
  {/if}
</Chart>
