<script lang="ts">
  import { BROWSER } from 'esm-env'

  import { mountChart } from './chart'
  import { onDestroy } from 'svelte'

  let className = ''
  export { className as class }

  export let data: any[]
  export let metrics: { key: string; title: string }[]
  export let xAxisKey = 'datetime' as string

  let chartNode: HTMLCanvasElement
  let chart: any

  $: BROWSER && chartNode && updateChart(chartNode, { data, xAxisKey, metrics })

  async function updateChart(node: HTMLCanvasElement, vars: any) {
    console.log({ chart })
    chart = await mountChart(node, vars, chart)
  }

  onDestroy(() => {
    if (BROWSER && chart) {
      chart.destroy()
    }
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
    min-height: 0;
  }
</style>
