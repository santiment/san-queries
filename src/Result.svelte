<script>
  import { downloadCsv } from 'webkit/utils/csv'
  import Svg from 'webkit/ui/Svg/svelte'
  import { PanelType } from '@/types'
  import NewVisualization from './NewVisualization.svelte'
  import RowPanels from './RowPanels.svelte'
  import Table from './Table/index.svelte'
  import Chart from './Chart/index.svelte'
  import Visualizations from './Visualizations.svelte'
  import Options from './Result/Options/index.svelte'
  import { getAppContext } from '@/context'

  const { dashboard$ } = getAppContext()

  export let data
  export let headers = []
  export let rows = []
  export let columns
  export let dateColumns

  let dashboard = $dashboard$
  let visualizations = dashboard.panels
  let visualization = visualizations[0]
  // NOTE: `$: visualization = dashboard?.panels[0]` doesn't allow to change `visualization` using bind:visualization [@vanguard]
  dashboard$.subscribe((value) => (dashboard = value))

  $: visualization && dateColumns && normalizeVisualization(dateColumns)
  $: visibleColumns = getVisibleColumns(columns)

  function normalizeVisualization(dateColumns) {
    if (visualization.type !== PanelType.CHART) return
    if (dateColumns.has(visualization.xAxisKey)) return

    visualization.xAxisKey = [...dateColumns][0]
  }

  function getVisibleColumns(columns) {
    return columns.filter((column) => !column.isHidden)
  }

  function onDownload() {
    console.log(visualization)
    downloadCsv(visualization.title, columns, rows)
  }
</script>

<div class="row v-center mrg-l mrg--b">
  <h2 class="body-2 mrg-xl mrg--r">Query results</h2>

  <Visualizations bind:visualization {visualizations} />

  <NewVisualization bind:visualization bind:visualizations={$dashboard$.panels} />
</div>

{#if visualization}
  <RowPanels class="$style.result">
    <svelte:fragment slot="left">
      {#if data}
        <div class="row v-center">
          <div class="body-2 mrg-a mrg--r">{visualization.title}</div>

          <div class="row">
            <button class="action btn-3" on:click={onDownload}><Svg id="download" w="17" /></button>
            <button class="action btn-3"><Svg id="fullscreen" w="14" /></button>
          </div>
        </div>

        {#if visualization.type === PanelType.TABLE}
          <Table columns={visibleColumns} data={rows} />
        {:else}
          <Chart
            columns={visibleColumns}
            data={rows}
            {dateColumns}
            xAxisKey={visualization.xAxisKey} />
        {/if}
      {:else}
        <div class="column hv-center">
          <h2 class="body-2 txt-b">No data</h2>
          <p class="mrg-xs mrg--t">Run your query first</p>
        </div>
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="right">
      <Options bind:visualization bind:columns {headers} {dateColumns} />
    </svelte:fragment>
  </RowPanels>
{:else}
  <div class="border column hv-center">
    <h2 class="body-2 txt-b">No visualization</h2>
    <p class="mrg-xs mrg--t">Create and select visualization first</p>
  </div>
{/if}

<style>
  .result {
    flex: 1;
  }

  .action {
    --fill: var(--waterloo);
    margin-left: 8px;
  }

  .column {
    min-height: 284px;
    flex: 1;
  }
</style>
