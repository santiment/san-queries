import type { ChartType } from 'chart.js'

export const AXES_LAST_VALUE_PLUGIN = {
  id: 'custom_canvas_background_color',
  afterDraw: (chart: any, _: any, options: any) => {
    const { ctx } = chart
    ctx.save()

    const BUBBLE_HEIGHT = 13
    const BUBBLE_HALF_HEIGHT = Math.round(BUBBLE_HEIGHT / 2)
    const BUBBLE_PADDING = 3
    const BUBBLE_DOUBLE_PADDING = BUBBLE_PADDING + BUBBLE_PADDING

    ctx.globalCompositeOperation = 'destination-over'

    chart.data.datasets.forEach(({ yAxisID, parsing }: any) => {
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
    color: 'red',
    MinMax: {},
  },
}

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    custom_canvas_background_color?: {
      MinMax: any
    }
  }
}
