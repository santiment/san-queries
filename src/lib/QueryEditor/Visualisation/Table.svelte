<script lang="ts">
  import Table from 'webkit/ui/Table/Paged.svelte'

  let className = ''
  export { className as class }
  export let sqlData = { rows: [], types: [], headers: [] } as App.SqlData
  export let ColumnSettings = {} as any
  export let border = true

  $: columns = sqlData.headers.map((key, i) => {
    const settings = ColumnSettings[key] || {}
    let sortAccessor

    const type = sqlData.types[i]
    if (type === 'DateTime') {
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
</script>

<table-widget class="column {className}" class:border>
  <Table items={sqlData.rows} {columns} sticky />
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

      + .paged {
        position: sticky;
        bottom: 0;
        left: 0;
        padding: 16px 32px;
        background: var(--white);
        z-index: 2;
      }
    }
  }
</style>
