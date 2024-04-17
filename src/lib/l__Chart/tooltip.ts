import { getDateFormats, getTimeFormats } from 'san-webkit/lib/utils/dates'

export function getTooltip() {
  return {
    callbacks: {
      title: (ctx) => {
        const { dataset, raw } = ctx[0] || {}
        if (!dataset) return ''

        const datetime = raw[dataset.parsing?.xAxisKey]
        if (!datetime) return ''

        const date = new Date(datetime)

        const { DD, MMMM, YYYY } = getDateFormats(date)
        const { HH, mm } = getTimeFormats(date)

        return `${HH}:${mm}, ${MMMM} ${DD}, ${YYYY}`
      },

      label: (ctx) => {
        const { metric, yAxisID } = ctx.dataset
        if (!metric.format) return

        return metric.title + ': ' + metric.format(ctx.raw[yAxisID])
      },
    },

    bodyFont: {
      size: 12,
    },
  }
}
