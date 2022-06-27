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
  </svelte:fragment>
</RowPanels>

<style>
  textarea {
    resize: none;
  }

  b {
    font-weight: bold;
  }

  button {
    padding: 6px 31px;
  }
</style>
