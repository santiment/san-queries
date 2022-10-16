<script lang="ts">
  import RowPanels from '@/RowPanels.svelte'
  import Options from './Options/index.svelte'
  import Visualization from './Visualization.svelte'
  import Header from './Header.svelte'
  import { Formatter, FormatType } from './Options/format'

  export let panel
  export let computedSql
  export let rows, headers, dateColumns

  let columnsHash = ''
  let columns = []

  $: newColumns(headers)
  $: columns.length && updateColumns(columns)

  const newColumns = (headers) => (columns = headers.map(newColumn))
  function newColumn(title, i) {
    const accessor = (data) => data[i]

    const column = {
      id: i,
      title,
      accessor,
      format: accessor,
      sortAccessor: accessor,
    }

    if (dateColumns.has(i)) {
      const { id, fn } = Formatter[FormatType.DATE]
      column.format = (data) => fn(accessor(data))
      column.formatter = fn
      column.formatterId = id
      column.sortAccessor = (data) => Date.parse(data[i])
    }

    return column
  }

  function updateColumns(columns) {
    const { settings } = panel
    const hash = headers.toString() || ''
    const isOldHash = !columnsHash || columnsHash === hash

    if (isOldHash && settings.columns.length === columns.length) {
      settings.columns.forEach((column, i) => {
        Object.assign(columns[i], column)
      })
    }

    columnsHash = hash
    settings.columns = columns
  }
</script>

<Header bind:panel />

<RowPanels class="$style.result">
  <svelte:fragment slot="left">
    {#if rows}
      <Visualization {panel} {columns} {rows} {dateColumns} />
    {:else}
      <div class="column hv-center">
        <h2 class="body-2 txt-b">No data</h2>
        <p class="mrg-xs mrg--t">Run your query first</p>
      </div>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="right">
    <Options bind:panel bind:columns {headers} {dateColumns} />
  </svelte:fragment>
</RowPanels>

<style>
  .result {
    flex: 1;
    min-height: 0;
  }

  .column {
    min-height: 284px;
    flex: 1;
  }
</style>
