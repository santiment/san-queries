<script>
  import { downloadCsv } from 'webkit/utils/csv'
  import Svg from 'webkit/ui/Svg/svelte'
  import NewVisualization from './NewVisualization.svelte'
  import RowPanels from './RowPanels.svelte'
  import Table from './Table/index.svelte'
  import Chart from './Chart/index.svelte'
  import Visualizations from './Visualizations.svelte'
  import Options from './Result/Options/index.svelte'

  let visualization = {
    type: 'table',
    title: 'My table',
  }

  const headers = ['title', 'volume']
  $: columns = headers.map((title, i) => {
    const accessor = (data) => data[i]
    return { title, accessor, format: accessor, sortAccessor: accessor }
  })

  const ITEMS = [
    [300, 2000],
    [100, 4000],
    [800, 90],
    [50, 1000],
    [2000, 30],
    [150, 5000],
  ]

  const data = ITEMS.concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .map((v, i) => {
      v.id = i
      return { ...v }
    })

  function onDownload() {
    console.log(visualization)
    downloadCsv(visualization.title, columns, data)
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
      <Table {columns} {data} />
    {:else}
      <Chart {columns} {data} />
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
