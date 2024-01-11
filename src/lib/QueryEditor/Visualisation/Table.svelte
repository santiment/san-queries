<script context="module" lang="ts">
  export function getTableColumns(sqlData: App.SqlData, ColumnSettings: Record<string, any>) {
    return sqlData.headers.map((key, i) => {
      const settings = ColumnSettings[key] || {}

      let format = settings.formatter?.format

      let sortAccessor

      const type = sqlData.types[i]
      if (type === 'DateTime' || type === 'Date') {
        sortAccessor = (item: any) => Date.parse(item[i])
      } else if (type.includes('Int') || type.includes('Float')) {
        sortAccessor = (item: any) => +item[i]
      }

      let Component: ComponentType
      let className = ''
      if (
        format === Formatter[FormatType.PERCENT_CHANGE].format ||
        format === Formatter[FormatType.LABELS].format ||
        format === Formatter[FormatType.TIME_SINCE].format ||
        format === Formatter[FormatType.ADDRESS].format
      ) {
        Component = format
      }

      if (
        format === Formatter[FormatType.TIME_SINCE].format ||
        format === Formatter[FormatType.ADDRESS].format
      ) {
        className = 'cell-visible'
      }

      return {
        key,
        title: settings.title || key,
        valueKey: i,
        format: (row: any, i: number, value: any) => (format ? format(value) : value),
        sortAccessor,
        Component,
        className,
      }
    })
  }

  export type TableColumn = ReturnType<typeof getTableColumns>[0]
</script>

<script lang="ts">
  import { noop } from 'webkit/utils'
  import Table from 'webkit/ui/Table/Paged.svelte'
  import { FormatType, Formatter } from './Controls/FormattingControl.svelte'
  import type { ComponentType } from 'svelte'

  const defaultSqlData = { rows: [], types: [], headers: [] }

  let className = ''
  export { className as class }
  export let sqlData = defaultSqlData as App.SqlData
  export let ColumnSettings = {} as any
  export let border = true
  export let columns = undefined as undefined | TableColumn[]
  export let onSortClick = noop as any
  export let sort = { column: undefined, dir: 'desc' as 'desc' | 'asc' }

  $: if (!sqlData) sqlData = defaultSqlData
  $: tableColumns = columns || getTableColumns(sqlData || defaultSqlData, ColumnSettings)
</script>

<table-widget class="column {className}" class:border>
  <Table
    items={sqlData.rows}
    columns={tableColumns}
    sticky
    {onSortClick}
    sortedColumn={sort.column}
    sortDirection={sort.dir}
  />
</table-widget>

<style lang="scss">
  table-widget {
    flex: 1;

    :global(.paged) {
      padding: 16px;
      margin: 0;
    }
  }

  Table {
    overflow: auto;
    flex: 1;

    :global {
      // th {
      //   padding: 0 15px !important;
      // }

      td {
        border-bottom: 1px solid var(--porcelain);
        white-space: pre !important;
      }
    }
  }
</style>
