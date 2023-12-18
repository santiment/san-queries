import { AXES_LAST_VALUE_PLUGIN } from './axes'
import { getMinMax } from './minMax'
import { getScales } from './scales'
import { getTooltip } from './tooltip'

export async function mountChart(
  node: HTMLCanvasElement,
  { data, xAxisKey, metrics },
  chart?: any,
) {
  const { default: ChartJs } = await import('chart.js/auto')

  ChartJs.defaults.font.family = 'Proxima Nova'
  ChartJs.defaults.font.size = 10

  const axesMetrics = metrics.slice(0, 4).map(({ key }) => key)

  const MinMax = getMinMax(axesMetrics, data)
  const scales = getScales(metrics, MinMax)

  const xAxisLabels = data.map((row) => row[xAxisKey])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const settings = {
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

        borderColor: metric.color,
        metric,

        pointRadius: 0,

        parsing: {
          yAxisKey: metric.key,
          xAxisKey: xAxisKey,
        },
      })),
    },
  }

  if (chart) {
    Object.assign(chart, settings)
    chart.update()

    return chart
  }

  return new ChartJs(node, settings)
}
