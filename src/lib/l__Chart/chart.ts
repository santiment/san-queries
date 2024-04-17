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
      animation: false,
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
      datasets: metrics.map((metric, i) => ({
        data,
        order: metric.node === 'Bars' ? 1000 : i,
        type: getMetricType(metric.node),
        label: metric.title,
        yAxisID: metric.key,

        borderColor: metric.color,
        metric,

        pointRadius: 0,

        fill: {
          target: metric.node === 'Area' ? 'stack' : 'none',
        },
        backgroundColor(context) {
          const chart = context.chart
          const { ctx, chartArea } = chart

          if (!chartArea) return metric.color
          if (metric.node !== 'Area') return metric.color

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)

          // gradient.addColorStop(0.5, metric.color + '33')
          gradient.addColorStop(1, metric.color + 'ff')
          gradient.addColorStop(0, metric.color + '00')

          return gradient
        },

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

function getMetricType(chartNode?: string) {
  switch (chartNode) {
    case 'Bars':
      return 'bar'

    // case 'Area':
    // return 'area'
    default:
      return
  }
}
