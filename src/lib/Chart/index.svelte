<script lang="ts">
  import { onMount } from 'svelte'
  import { AXES_LAST_VALUE_PLUGIN } from './axes'

  let className = ''
  export { className as class }

  export let data: any[]
  export let metrics: { key: string; title: string }[]
  export let xAxisKey = 'datetime' as string

  let chartNode: HTMLCanvasElement

  onMount(() => {
    import('chart.js/auto').then(({ default: ChartJs }) => {
      ChartJs.defaults.font.family = 'Proxima Nova'
      ChartJs.defaults.font.size = 10

      const MinMax = {} as Record<string, { min: number; max: number; lastValue?: number }>
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

          if (!MinMax[key]) {
            MinMax[key] = {
              min: Infinity,
              max: -Infinity,
              lastValue: undefined as undefined | number,
            }
          }

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

      ChartJs.register(AXES_LAST_VALUE_PLUGIN)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
