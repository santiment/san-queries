<script lang="ts">
  import Table from 'webkit/ui/Table/Paged.svelte'

  let className = ''
  export { className as class }
  export let sqlData = { rows: [] as any[], types: [] as any[], headers: [] as any[] }
  export let ColumnSettings: any

  $: columns = sqlData.headers.map((key, i) => {
    const settings = ColumnSettings[key] || {}
    let sortAccessor

    const type = sqlData.types[i]
    if (type === 'DateTime') {
      sortAccessor = (item: any) => Date.parse(item[i])
    } else if (type.includes('Int')) {
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

<table-widget class="column border">
  <Table items={sqlData.rows} {columns} class={className} sticky />
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
