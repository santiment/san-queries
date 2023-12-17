<script lang="ts">
  import { BROWSER } from 'esm-env'

  import { mountChart } from './chart'

  let className = ''
  export { className as class }

  export let data: any[]
  export let metrics: { key: string; title: string }[]
  export let xAxisKey = 'datetime' as string

  let chartNode: HTMLCanvasElement

  $: BROWSER && mountChart(chartNode, { data, xAxisKey, metrics })
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
