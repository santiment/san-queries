<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import NewVisualization from './NewVisualization.svelte'
  import RowPanels from './RowPanels.svelte'
  import Table from './Table/index.svelte'
  import Chart from './Chart/index.svelte'
  import Visualizations from './Visualizations.svelte'
  import Field from './Field.svelte'
  import FormatOption from './Result/Options/Format.svelte'

  let visualization = {
    type: 'table',
    title: 'My table',
  }

  const headers = ['title', 'volume']
  $: columns = headers.map((title, i) => {
    const accessor = (data) => data[i]
    return { title, accessor, format: accessor, sortAccessor: accessor }
  })
</script>

<div class="row v-center">
  <h2 class="body-2 mrg-xl mrg--r">Query results</h2>

  <Visualizations bind:visualization />

  <NewVisualization />
</div>

<RowPanels class="mrg-l mrg--t">
  <svelte:fragment slot="left">
    <div class="row v-center">
      <div class="body-2 mrg-a mrg--r">{visualization.title}</div>

      <div class="row">
        <button class="action btn-3"><Svg id="download" w="17" /></button>
        <button class="action btn-3"><Svg id="fullscreen" w="14" /></button>
      </div>
    </div>

    {#if visualization.type === 'table'}
      <Table {columns} />
    {:else}
      <Chart />
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="right">
    <h3 class="body-2">Options</h3>

    <div class="scroll">
      <Field title="Table name" placeholder="My table" bind:value={visualization.title} />

      {#each columns as column, i}
        <Field
          title={`Column ${i}: Title - ${headers[i]}`}
          placeholder={headers[i]}
          bind:value={column.title} />
        <FormatOption {i} bind:column={columns[i]} />
      {/each}
    </div>
  </svelte:fragment>
</RowPanels>

<style>
  h3 {
    border-bottom: 1px solid var(--porcelain);
    padding: 0 0 16px;
  }

  .action {
    --fill: var(--waterloo);
    margin-left: 8px;
  }

  .scroll {
    --max-height: 446px;
  }
</style>
