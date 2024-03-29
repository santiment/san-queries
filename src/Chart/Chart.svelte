<script>
  import { getUI$Ctx } from 'webkit/stores/ui'
  import { getDateFormats, getTimeFormats } from 'webkit/utils/dates'
  import { themes } from 'studio/Chart/theme'
  import { getMetricNodes } from 'studio/Chart/nodes'
  import Chart from 'studio/Chart/index.svelte'
  import Lines from 'studio/Chart/Lines.svelte'
  import Areas from 'studio/Chart/Areas.svelte'
  import Bars from 'studio/Chart/Bars.svelte'
  import Axes from 'studio/Chart/Axes/index.svelte'
  import Tooltip from 'studio/Chart/Tooltip/index.svelte'
  import { FORMATTER } from 'studio/metrics/formatters'

  export let data
  export let metrics
  export let colors
  export let axesMetricKeys
  export let onChart

  const { ui$ } = getUI$Ctx()

  $: theme = themes[+$ui$.isNightMode] // +$globals.isNightMode]
  $: categories = getMetricNodes(metrics, {})
  $: metricSettings = getTooltipSettings(metrics)

  function getTooltipSettings(metrics) {
    const metricSettings = {
      datetime: {
        formatter: (value) => {
          const date = new Date(value)
          const { HH, mm } = getTimeFormats(date)
          const { MMMM, DD, YYYY } = getDateFormats(date)
          return `${HH}:${mm}, ${MMMM} ${DD}, ${YYYY}`
        },
      },
    }

    metrics.forEach((column) => {
      const { key, formatter = FORMATTER, label, axisFormatter = formatter } = column

      metricSettings[key] = Object.assign({
        label,
        formatter,
        axisFormatter,
      })
    })

    return metricSettings
  }
</script>

<Chart {data} {categories} {theme} {colors} {onChart}>
  <Bars />
  <Areas />
  <Lines />

  <Axes {axesMetricKeys} {metricSettings} xTicks={10} />

  {#if process.browser}
    <Tooltip {axesMetricKeys} {metricSettings} isShiftForced />
  {/if}
</Chart>
