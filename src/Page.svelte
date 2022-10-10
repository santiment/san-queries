<script lang="ts">
  import ExecuteButton from '@/Query/ExecuteButton.svelte'
  import Table from '@/Table/index.svelte'
  import { PanelType } from './types'

  export let dashboard
  export let onPanelSelect

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
    {@const {
      __rows = [],
      settings: { type, columns },
    } = panel}
    <div class="panel border btn column" on:click={() => onPanelSelect(panel)}>
      <h3 class="body-2 txt-center single-line">{panel.name}</h3>
      <div class="widget column c-black">
        {#if type === PanelType.TABLE}
          <Table class="$style.table" columns={columns.filter((c) => !c.isHidden)} data={__rows} />
        {/if}
      </div>
    </div>
  {/each}
</section>

<style>
  section {
    gap: 24px;
    display: grid;
  }

  .panel {
    height: 400px;
    background: var(--white);
    --color-hover: var(--green);
  }

  .new {
    background: var(--white);
  }

  h3 {
    border-bottom: 1px solid var(--porcelain);
    padding: 3px;
  }

  .widget {
    /* padding: 0 16px 8px; */
    padding: 0 10px 10px;
    flex: 1;
    overflow: auto;
  }

  .table {
    margin: 0 -10px;
  }
</style>
