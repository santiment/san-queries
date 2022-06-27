<script>
  import RowPanels from './RowPanels.svelte'
</script>

<RowPanels class="mrg-xl mrg--t mrg--b">
  <svelte:fragment slot="left">
    <textarea name="" id="" cols="30" rows="10" />
  </svelte:fragment>

  <svelte:fragment slot="right">
    <div class="row nowrap">
      <button class="btn-1 btn--accent">Run Query</button>
      <div class="caption mrg-l mrg--l">
        Last run <b>3 min ago</b>
        <br />
        Avg. running time <b>1 min</b>
      </div>
    </div>

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
  textarea {
    resize: none;
    width: 100%;
    height: 100%;
  }

  b {
    font-weight: bold;
  }

  button {
    padding: 6px 31px;
  }

  .scroll {
    margin: 12px -16px 0 0;
  }
</style>
