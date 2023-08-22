<script lang="ts">
  import { onMount } from 'svelte'

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

      console.log(
        { data, metrics, xAxisKey },
        data.map((row) => row[xAxisKey]),
      )

      const scales = {} as Record<string, any>
      metrics.slice(0, 4).forEach(({ key }) => {
        scales[key] = { position: 'right' }
      })

      new ChartJs(chartNode, {
        type: 'line',

        options: {
          maintainAspectRatio: false,
          responsive: true,

          interaction: {
            intersect: false,
            mode: 'nearest',
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
          },

          scales,

          parsing: {
            xAxisKey,
          },
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
