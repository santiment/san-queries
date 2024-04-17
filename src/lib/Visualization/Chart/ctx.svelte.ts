import type { SS } from 'svelte-runes'
import { createCtx } from '$lib/ctx'
import { COLORS } from '$lib/ui/Parameter'
import { Formatter } from '../format'

export function getChartSetup(
  sqlData: App.SqlData,
  ColumnSettings: Record<string, App.ColumnSettings>,
) {
  const metrics = [] as { key: string; valueKey: number }[]
  const dateColumns = new Set<string>()
  const MetricByColumn = {} as Record<string, null | (typeof metrics)[number]>

  let dateColumn: string

  let colorId = 0

  sqlData.columns.forEach((key, i) => {
    const settings = ColumnSettings[key] || {}

    const type = sqlData.columnTypes[i]
    if (type.includes('Date')) {
      dateColumns.add(key)

      if (!dateColumn) dateColumn = i.toString()

      return
    }

    if (type.includes('Int') === false && type.includes('Float') === false) {
      return
    }

    let format =
      settings.formatter === undefined
        ? undefined
        : Formatter[settings.formatter as unknown as keyof typeof Formatter]?.format

    const metric = {
      key: i.toString(),
      header: key,
      title: settings.title || key,
      valueKey: i,
      color: settings.chartColor || COLORS[colorId++],
      format,
      node: settings.chartNode,
    }
    MetricByColumn[key] = metric

    if (settings.isHiddenOnChart) return

    metrics.push(metric)
  })

  return { metrics, MetricByColumn, dateColumns, dateColumn: dateColumn! || '0' }
}

export const useChartVisualizationCtx = createCtx(
  'useTableColumnsCtx',
  (sqlData: App.SqlData, settings: SS<Record<string, any>>) => {
    const ctx = $derived.by(() => getChartSetup(sqlData, settings.$))

    return {
      ctx: {
        get $() {
          return ctx
        },
      },
    }
  },
)
