<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import RowPanels from './RowPanels.svelte'
  import Table from './Table/index.svelte'
</script>

<div class="body-2">Query results</div>
<RowPanels class="mrg-l mrg--t">
  <svelte:fragment slot="left">
    <div class="row v-center">
      <div class="body-2 mrg-a mrg--r">My table</div>

      <div class="row">
        <button class="action btn-3"><Svg id="download" w="17" /></button>
        <button class="action btn-3"><Svg id="fullscreen" w="14" /></button>
      </div>
    </div>

    <Table />
  </svelte:fragment>

  <svelte:fragment slot="right">
    <h2 class="body-2">Options</h2>

    <div class="scroll">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui maiores ipsum non eaque dicta est
      excepturi molestias distinctio quos ducimus tenetur commodi nobis corrupti eum enim eveniet,
      harum tempora fugit voluptatum! Quia laudantium sapiente sit fugit voluptatum dolores vitae
      cupiditate officia tempora, adipisci, cumque libero repudiandae et a tempore quo quis quasi
      consequuntur maxime, quos voluptatem ratione facere possimus. Repellat delectus et consequatur
      dolores rem explicabo ut illum, placeat sed dicta ipsa sequi magnam optio fugit rerum sit
      totam maxime? Aliquid fugiat, incidunt repudiandae aperiam pariatur maiores corporis omnis
      accusamus praesentium fuga rem nam aliquam natus minima, quisquam adipisci odio?
    </div>
  </svelte:fragment>
</RowPanels>

<style>
  h2 {
    border-bottom: 1px solid var(--porcelain);
    padding: 0 0 16px;
  }

  .action {
    --fill: var(--waterloo);
    margin-left: 8px;
  }

  .scroll {
    --max-height: 522px;
  }
</style>
