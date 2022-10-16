<script lang="ts">
  import { PanelType } from '@/types'
  import Table from '@/Table/index.svelte'

  export let panel

  $: ({ settings, __rows = [] } = panel)
  $: ({ columns, type } = settings)
</script>

<div class="panel border column">
  <h3 class="btn body-2 txt-center single-line" on:click>
    {panel.name}
  </h3>

  <div class="widget column c-black relative">
    {#if type === PanelType.TABLE}
      <Table class="$style.table" columns={columns.filter((c) => !c.isHidden)} data={__rows} />
    {/if}

    {#if !__rows || !__rows.length}
      <div class="empty c-waterloo body-2">No data</div>
    {/if}
  </div>
</div>

<style>
  .panel {
    height: 400px;
    background: var(--white);
    --color-hover: var(--green);
  }

  h3 {
    border-radius: 0;
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

  .empty {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 12px 20px;
    background: var(--athens);
    transform: translate3d(-50%, -60%, 0);
    border-radius: 4px;
  }
</style>