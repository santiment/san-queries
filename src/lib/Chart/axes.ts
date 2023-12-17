import type { ChartType } from 'chart.js'

// NOTE: http://stackoverflow.com/a/3943023/112731 [@vanguard | Mar  9, 2021]
export function getBubbleFontColorHex(color: string, isNightMode = false) {
  // const r = parseInt(color.slice(1, 3), 16)
  // const g = parseInt(color.slice(3, 5), 16)
  // const b = parseInt(color.slice(5, 7), 16)
  const [r, g, b] = color.match(/(\d)+/g)

  const threshold = 175 - (isNightMode ? 37 : 0)
  return r * 0.299 + g * 0.587 + b * 0.114 > threshold ? '#000000' : '#ffffff'
}

export const AXES_LAST_VALUE_PLUGIN = {
  id: 'custom_canvas_background_color',
  afterDraw: (chart: any, _: any, options: any) => {
    const { ctx } = chart
    ctx.save()

    const BUBBLE_HEIGHT = 13
    const BUBBLE_HALF_HEIGHT = Math.round(BUBBLE_HEIGHT / 2)
    const BUBBLE_PADDING = 3
    const BUBBLE_DOUBLE_PADDING = BUBBLE_PADDING + BUBBLE_PADDING

    chart.data.datasets.forEach(({ yAxisID, parsing, borderColor }: any) => {
      const key = parsing.yAxisKey
      const { min, max, lastValue } = options.MinMax[key]
      const scale = chart.scales[yAxisID]

      const factor = scale.height / (max - min)
      const top = (max - lastValue) * factor + scale.top

      let { left } = scale
      left += BUBBLE_PADDING

      const width = ctx.measureText(lastValue).width

      ctx.fillStyle = borderColor
      ctx.fillRect(left, top - BUBBLE_HALF_HEIGHT, width + BUBBLE_DOUBLE_PADDING, BUBBLE_HEIGHT)

      ctx.textBaseline = 'middle'
      ctx.fillStyle = getBubbleFontColorHex(borderColor)
      ctx.fillText(lastValue, left + BUBBLE_PADDING, top)
    })

    ctx.restore()
  },
  defaults: {
    color: 'green',
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
