<script>
  import { downloadCsv } from 'webkit/utils/csv'
  import Svg from 'webkit/ui/Svg/svelte'
  import NewVisualization from './NewVisualization.svelte'
  import RowPanels from './RowPanels.svelte'
  import Table from './Table/index.svelte'
  import Chart from './Chart/index.svelte'
  import Visualizations from './Visualizations.svelte'
  import Options from './Result/Options/index.svelte'

  export let headers = []
  export let rows = []
  export let columns

  let visualization = {
    type: 'table',
    title: 'My table',
  }

  function onDownload() {
    console.log(visualization)
    downloadCsv(visualization.title, columns, rows)
  }
</script>

<div class="row v-center">
  <h2 class="body-2 mrg-xl mrg--r">Query results</h2>

  <Visualizations bind:visualization />

  <NewVisualization />
</div>

<RowPanels class="$style.result mrg-l mrg--t">
  <svelte:fragment slot="left">
    <div class="row v-center">
      <div class="body-2 mrg-a mrg--r">{visualization.title}</div>

      <div class="row">
        <button class="action btn-3" on:click={onDownload}><Svg id="download" w="17" /></button>
        <button class="action btn-3"><Svg id="fullscreen" w="14" /></button>
      </div>
    </div>

    {#if visualization.type === 'table'}
      <Table {columns} data={rows} />
    {:else}
      <Chart {columns} data={rows} />
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="right">
    <Options bind:visualization bind:columns {headers} />
  </svelte:fragment>
</RowPanels>

<style>
  .result {
    flex: 1;
  }

  .action {
    --fill: var(--waterloo);
    margin-left: 8px;
  }
</style>
