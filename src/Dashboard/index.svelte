<script lang="ts">
  import Panel from './Panel.svelte'

  export let dashboard
  export let selectedPanel

  function onExecuteClick(item) {
    console.log(item)
  }

  function onQueryError() {}
</script>

<div class="row mrg-l mrg--b justify">
  <div class="btn-1">Get data</div>

  <button class="new btn-2">New panel</button>
</div>

<section>
  {#each dashboard.panels as panel}
    <Panel {panel} on:click={() => (selectedPanel = panel)} />
  {/each}
</section>

<style>
  section {
    gap: 24px;
    display: grid;
  }

  .new {
    background: var(--white);
  }
</style>
