<script lang="ts">
  import { onMount } from 'svelte'

  let className = ''
  export { className as class }

  export let data: any[]
  export let metrics: { key: string; title: string }[]
  export let xAxisKey = 'datetime' as string

  let chartNode: HTMLCanvasElement

  const TEST = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart, args, options) => {
      const { ctx } = chart
      ctx.save()

      // ctx.globalCompositeOperation = 'destination-over'

      const BUBBLE_HEIGHT = 13
      const BUBBLE_HALF_HEIGHT = Math.round(BUBBLE_HEIGHT / 2)
      const BUBBLE_PADDING = 3
      const BUBBLE_DOUBLE_PADDING = BUBBLE_PADDING + BUBBLE_PADDING

      chart.data.datasets.forEach(({ yAxisID, parsing }) => {
        const key = parsing.yAxisKey
        const { min, max, lastValue } = options.MinMax[key]
        const scale = chart.scales[yAxisID]

        const factor = scale.height / (max - min)
        const top = (max - lastValue) * factor + scale.top

        let { left, width } = scale
        left += BUBBLE_PADDING

        ctx.fillStyle = options.color
        ctx.fillRect(left, top - BUBBLE_HALF_HEIGHT, width - BUBBLE_DOUBLE_PADDING, BUBBLE_HEIGHT)

        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'black'
        ctx.fillText(lastValue, left + BUBBLE_PADDING, top)
      })

      ctx.restore()
    },
    defaults: {
      color: 'lightGreen',
      MinMax: {},
    },
  }

  onMount(() => {
    import('chart.js/auto').then(({ default: ChartJs }) => {
      ChartJs.defaults.font.family = 'Proxima Nova'
      ChartJs.defaults.font.size = 10

      const MinMax = {} as Record<string, { min: number; max: number }>
      const scales = {
        x: {
          ticks: {
            maxTicksLimit: 10,
          },
        },
      } as Record<string, any>

      const axesMetrics = metrics.slice(0, 4).map(({ key }) => key)

      data.forEach((row) => {
        axesMetrics.forEach((key) => {
          const value = row[key]

          if (!MinMax[key]) MinMax[key] = { min: Infinity, max: -Infinity }

          const minMax = MinMax[key]

          if (value < minMax.min) minMax.min = value
          if (value > minMax.max) minMax.max = value
          if (Number.isFinite(value)) minMax.lastValue = value
        })
      })

      axesMetrics.forEach((key) => {
        const { min, max } = MinMax[key]
        scales[key] = {
          position: 'right',
          min,
          max,
          ticks: {
            stepSize: (max - min) / 5,
          },
        }
      })

      ChartJs.register(TEST)

      const chart = new ChartJs(chartNode, {
        type: 'line',

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
            tooltip: {
              bodyFont: {
                size: 12,
              },
            },
            custom_canvas_background_color: {
              MinMax,
            },
          },

          scales,
        },

        data: {
          labels: data.map((row) => row[xAxisKey]),
          datasets: metrics.map((metric) => ({
            data,
            label: metric.title,
            yAxisID: metric.key,

            parsing: {
              yAxisKey: metric.key,
              xAxisKey: xAxisKey,
            },
          })),
        },
      })
    })
  })
</script>

<chart class="column {className}">
  <canvas bind:this={chartNode} />

  <slot />
</chart>

<style>
  chart,
  canvas {
    flex: 1;
  }
</style>
