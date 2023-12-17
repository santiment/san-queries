import { getDateFormats } from 'san-webkit/lib/utils/dates'
import { themes } from './theme'
import { millify } from 'webkit/utils/formatting'

export function getScales(metrics: string[], MinMax: any) {
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

  metrics.forEach(({ key, color }, i) => {
    const { min, max } = MinMax[key]
    const margin = (max - min) * 0.05

    scales[key] = {
      position: 'right',
      min: min - margin,
      max: max + margin,
      grid: { display: false },

      border: { color },
      paddingRight: 20,

      ticks: {
        padding: 0,

        stepSize: (max - min) / 5,

        color: themes[0].ticks.color,

        callback: function (value) {
          return yAxisFormatter(value)
        },
      },
    }
  })

  return scales
}

export function yAxisFormatter(value: number) {
  const absValue = Math.abs(value)

  if (!value) {
    return 0
  }

  if (absValue < 0.01) {
    return +value.toFixed(6)
  }

  if (absValue < 10) {
    return +value.toFixed(3)
  }

  if (absValue < 100) {
    return millify(value, 3)
  }

  if (absValue > 999999) {
    return millify(value, 2)
  }

  if (absValue > 99999) {
    return millify(value, 0)
  }

  if (absValue > 9999) {
    return millify(value, 1)
  }

  return Math.trunc(value)
}
