<script lang="ts">
  import { BROWSER } from 'esm-env'
  import { AXES_LAST_VALUE_PLUGIN } from './axes'
  import { getMinMax } from './minMax'
  import { getScales } from './scales'
  import { getTooltip } from './tooltip'

  let className = ''
  export { className as class }

  export let data: any[]
  export let metrics: { key: string; title: string }[]
  export let xAxisKey = 'datetime' as string

  let chartNode: HTMLCanvasElement

  $: BROWSER && data && metrics && xAxisKey && mountChart()

  async function mountChart() {
    const ChartJs = (await import('chart.js/auto')).default

    ChartJs.defaults.font.family = 'Proxima Nova'
    ChartJs.defaults.font.size = 10

    const axesMetrics = metrics.slice(0, 4).map(({ key }) => key)

    const MinMax = getMinMax(axesMetrics, data)
    const scales = getScales(axesMetrics, MinMax)

    const xAxisLabels = data.map((row) => row[xAxisKey])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chart = new ChartJs(chartNode, {
      type: 'line',

      plugins: [AXES_LAST_VALUE_PLUGIN],

      options: {
        maintainAspectRatio: false,
        responsive: true,

        interaction: {
          intersect: false,
          mode: 'index',
        },

        plugins: {
          legend: {
            display: false,
          },
          tooltip: getTooltip(),
          custom_canvas_background_color: {
            MinMax,
          },
        },

        scales,
      },

      data: {
        labels: xAxisLabels,
        datasets: metrics.map((metric) => ({
          data,
          label: metric.title,
          yAxisID: metric.key,

          pointRadius: 0,

          parsing: {
            yAxisKey: metric.key,
            xAxisKey: xAxisKey,
          },
        })),
      },
    })
  }
</script>

<chart class="column {className}">
  <canvas bind:this={chartNode} />

  <slot />
</chart>

<style>
  chart,
  canvas {
    flex: 1;
    min-height: 0;
  }
</style>
