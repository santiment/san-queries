import { ssd, type SS } from 'svelte-runes'
import type { ComponentType } from 'svelte'
import { createCtx } from '$lib/ctx'
import { FormatType, Formatter } from '../format'

export function getTableColumns(sqlData: App.SqlData, ColumnSettings: Record<string, any>) {
  return sqlData.columns.map((key, i) => {
    const settings = ColumnSettings[key] || {}

    const type = sqlData.columnTypes[i]

    let format = +settings.formatter //?.format
    let formatter = Formatter[format]?.format

    let sortAccessor
    let filter: 'number' | 'search' | undefined
    if (type.includes('Date')) {
      sortAccessor = (item: any) => Date.parse(item[i])
    } else if (type.includes('Int') || type.includes('Float')) {
      sortAccessor = (item: any) => +item[i]
      filter = 'number'
    } else if (type.includes('String')) {
      filter = 'search'
    }

    let Cell: ComponentType | undefined

    let className = ''
    if (
      format === FormatType.PERCENT_CHANGE ||
      format === FormatType.LABELS ||
      format === FormatType.TIME_SINCE ||
      format === FormatType.ADDRESS
    ) {
      Cell = Formatter[format].Component
    }

    if (
      format === FormatType.TIME_SINCE ||
      format === FormatType.ADDRESS ||
      format === FormatType.LABELS
    ) {
      className = 'cell-visible'
    }

    return {
      key,
      filter,
      title: settings.title || key,
      valueKey: i.toString(),
      sortAccessor,
      Cell,
      className,
      format: (value: any) => (formatter ? formatter(value) : value),
    }
  })
}

export const useTableColumnsCtx = createCtx(
  'useTableColumnsCtx',
  (sqlData: App.SqlData, settings: SS<Record<string, any>>) => {
    // const dataColumns = $derived(getTableColumns(sqlData, settings.$))
    // $effect(() => console.log(dataColumns))
    const dataColumns = ssd(() => getTableColumns(sqlData, settings.$))

    return {
      dataColumns,
    }
  },
)
