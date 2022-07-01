<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import NewVisualization from './NewVisualization.svelte'
  import RowPanels from './RowPanels.svelte'
  import Table from './Table/index.svelte'
  import Chart from './Chart/index.svelte'
  import Visualizations from './Visualizations.svelte'
  import Field from './Field.svelte'

  let visualization = {
    type: 'table',
    title: 'My table',
  }

  const columns = ['title', 'volume']
  $: headers = columns.slice()
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
      <Table {headers} />
    {:else}
      <Chart />
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="right">
    <h3 class="body-2">Options</h3>

    <div class="scroll">
      <Field title="Table name" placeholder="My table" bind:value={visualization.title} />

      {#each columns as column, i}
        <Field title={`Column ${i}: ${column}`} placeholder={column} bind:value={headers[i]} />
      {/each}

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui maiores ipsum non eaque dicta est
      excepturi molestias distinctio quos ducimus tenetur commodi nobis corrupti eum enim eveniet,
      harum tempora fugit voluptatum! Quia laudantium sapiente sit fugit voluptatum dolores vitae
      cupiditate officia tempora, adipisci, cumque libero repudiandae et a tempore quo quis quasi
      consequuntur maxime, quos voluptatem ratione facere possimus. Repellat delectus et consequatur
      dolores rem explicabo ut illum, placeat sed dicta ipsa sequi magnam optio fugit rerum sit
      totam maxime? Aliquid fugiat, incidunt repudiandae aperiam pariatur maiores corporis omnis
      accusamus praesentium fuga rem nam aliquam natus minima, quisquam adipisci odio? cupiditate
      officia tempora, adipisci, cumque libero repudiandae et a tempore quo quis quasi consequuntur
      maxime, quos voluptatem ratione facere possimus. Repellat delectus et consequatur dolores rem
      explicabo ut illum, placeat sed dicta ipsa sequi magnam optio fugit rerum sit totam maxime?
      Aliquid fugiat, incidunt repudiandae aperiam pariatur maiores corporis omnis accusamus
      praesentium fuga rem nam aliquam natus minima, quisquam adipisci odio? cupiditate officia
      tempora, adipisci, cumque libero repudiandae et a tempore quo quis quasi consequuntur maxime,
      quos voluptatem ratione facere possimus. Repellat delectus et consequatur dolores rem
      explicabo ut illum, placeat sed dicta ipsa sequi magnam optio fugit rerum sit totam maxime?
      Aliquid fugiat, incidunt repudiandae aperiam pariatur maiores corporis omnis accusamus
      praesentium fuga rem nam aliquam natus minima, quisquam adipisci odio?
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
