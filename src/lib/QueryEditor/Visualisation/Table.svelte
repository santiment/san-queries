<script context="module" lang="ts">
  export function getTableColumns(sqlData: App.SqlData, ColumnSettings: Record<string, any>) {
    return sqlData.headers.map((key, i) => {
      const settings = ColumnSettings[key] || {}
      let sortAccessor

      const type = sqlData.types[i]
      if (type === 'DateTime' || type === 'Date') {
        sortAccessor = (item: any) => Date.parse(item[i])
      } else if (type.includes('Int') || type.includes('Float')) {
        sortAccessor = (item: any) => +item[i]
      }

      return {
        key,
        title: settings.title || key,
        valueKey: i,
        format: (row: any, i: number, value: any) => value,
        sortAccessor,
      }
    })
  }

  export type TableColumn = ReturnType<typeof getTableColumns>[0]
</script>

<script lang="ts">
  import Table from 'webkit/ui/Table/Paged.svelte'

  let className = ''
  export { className as class }
  export let sqlData = { rows: [], types: [], headers: [] } as App.SqlData
  export let ColumnSettings = {} as any
  export let border = true
  export let columns = undefined as undefined | TableColumn[]
  export let onSortClick = undefined as any
  export let sort = { column: undefined, dir: 'desc' as 'desc' | 'asc' }

  $: tableColumns = columns || getTableColumns(sqlData, ColumnSettings)
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
