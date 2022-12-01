<script lang="ts">
  import RowPanels from '@/RowPanels.svelte'
  import Options from './Options/index.svelte'
  import Visualization from './Visualization.svelte'
  import Header from './Header.svelte'
  import imgSrc from './no-data.svg'
  import { newColumn } from '@/utils/columns'

  export let panel
  export let rows, headers, dateColumns

  let columnsHash = ''
  let columns = []

  $: newColumns(headers)
  $: columns.length && updateColumns(columns)

  const newColumns = (headers) =>
    (columns = headers.map((title, i) => newColumn(title, i, dateColumns)))

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
    {#if rows && columns.length}
      <Visualization {panel} {columns} {rows} {dateColumns} />
    {:else}
      <div class="column hv-center">
        <img src={imgSrc} alt="No data" class="mrg-xl mrg--b" />
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
    /* min-height: 0; */
    min-height: 500px;
    max-height: 500px;
  }

  .column {
    min-height: 284px;
    flex: 1;
  }
</style>
