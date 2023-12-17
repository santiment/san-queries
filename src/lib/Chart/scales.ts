import { getDateFormats } from 'san-webkit/lib/utils/dates'
import { themes } from './theme'
import { COLORS } from '$lib/Parameter'

export function getScales(axesMetrics: string[], MinMax: any) {
  const scales = {
    x: {
      grid: {
        display: false,
      },

      ticks: {
        align: 'start',

        maxTicksLimit: 10,

        color: themes[0].ticks.color,

        callback: function (value) {
          const { DD, MMM, YY } = getDateFormats(new Date(this.getLabelForValue(value)))
          return `${DD} ${MMM} ${YY}`
        },
      },
    },
  } as Record<string, any>

  axesMetrics.forEach((key, i) => {
    const { min, max } = MinMax[key]
    scales[key] = {
      position: 'right',
      min,
      max,
      grid: { display: false, borderColor: 'red' },

      border: { color: COLORS[i] },

      ticks: {
        stepSize: (max - min) / 5,

        color: themes[0].ticks.color,
      },
    }
  })

  return scales
}
