<script lang="ts">
  import { initChart } from '@santiment-network/chart'
  import { newChartColors } from 'san-studio/lib/Chart/colors'

  export let data
  export let columns

  let canvasNode
  let chart

  $: rawData = data[data.length - 1]
  $: valueColumns = columns
    .filter(({ id }) => data[0] && Number.isFinite(data[0][id]))
    .map(({ id, title, accessor, format }) => ({
      key: id.toString(),
      title,
      accessor,
      format,
    }))
  $: colors = newChartColors(valueColumns)

  $: if (canvasNode) setup(canvasNode)
  $: if (chart) draw(chart, rawData)

  const DOUBLE_PI = 2 * Math.PI

  function setup(canvas: HTMLCanvasElement) {
    chart = initChart(canvas, canvas.offsetHeight, canvas.offsetHeight)
  }

  function draw(chart, data) {
    const { ctx, canvasHeight } = chart
    console.log(data, chart, valueColumns)

    const center = canvasHeight / 2
    const padding = 30
    const size = center - padding

    const results = [
      { mood: 'Angry', total: 1499, shade: '#FF5B5B' },
      { mood: 'Happy', total: 478, shade: '#FFCB47' },
      { mood: 'Melancholic', total: 332, shade: '#5275FF' },
      { mood: 'Gloomy', total: 195, shade: '#F47BF7' },
    ]

    let total = 0
    for (let i = 0; i < results.length; i++) total += results[i].total

    let angle = 0
    for (let i = 0; i < valueColumns.length; i++) {
      const column = valueColumns[i]
      const value = column.accessor(data)

      const sector = (value / total) * DOUBLE_PI

      ctx.beginPath()

      ctx.arc(center, center, size, angle, (angle += sector))
      ctx.lineTo(center, center)

      ctx.fillStyle = colors[column.key]
      ctx.fill()
    }
  }
</script>

<div class="pie row">
  <canvas bind:this={canvasNode} />

  <div class="labels column body-2 h-center mrg-a mrg--l">
    {#each valueColumns as { key, title, format }}
      <div class="row v-center">
        <div class="color mrg-s mrg--r" style="background:{colors[key]}" />
        {title}: <span class="c-waterloo mrg-xs mrg--l">{format(rawData)}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .pie {
    flex: 1;
  }

  .labels {
    width: 50%;
  }

  .color {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
</style>
