<script>import { onMount } from 'svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Resizer from 'san-webkit/lib/ui/SnapGrid/Resizer.svelte';
import { notifications$ } from 'san-webkit/lib/ui/Notifications';
import { PanelType } from './../types';
import Table from './../Table/index.svelte';
import Text from './../visualizations/Text.svelte';
import Chart from './../Chart/index.svelte';
import PieChart from './../visualizations/PieChart/index.svelte';
import { queryComputeRawClickhouse } from './../api/query/raw';
import { getParametersMap } from './../utils/parameters';
import { applyPanelData } from './../utils/columns';
import { noop } from 'svelte/internal';
import { mutateComputeAndStorePanel } from './../api/query/store';
let className;
export { className as class };
export let dashboard;
export let panel;
export let style;
export let onDelete;
export let onDrag;
export let onResizeEnd;
let node;

$: ({
  settings,
  __rows = [],
  __computedSql
} = panel);

$: ({
  columns,
  type
} = settings);

$: visibleColumns = columns.filter(c => !c.isHidden);

$: ({
  dateColumns = new Set()
} = __computedSql || {});

function onUpdateClick() {
  const {
    id,
    sql
  } = panel;
  const {
    query,
    parameters
  } = sql;

  if (id) {
    mutateComputeAndStorePanel(dashboard.id, id).catch(noop);
  }

  return queryComputeRawClickhouse(query, getParametersMap(parameters)).then(data => {
    applyPanelData(panel, data);
    panel = panel;
  }).catch(e => {
    console.log(e);
    notifications$.show({
      title: 'Error during data load',
      type: 'error'
    });
  });
}

onMount(() => {
  if (panel.__scrollOnMount) {
    node.scrollIntoView({
      behavior: 'smooth'
    });
    delete panel.__scrollOnMount;
  }
});</script>

<div
  {style}
  on:mousedown={onDrag}
  class="panel border column {className}"
  class:panel_text={type === PanelType.TEXT}
  bind:this={node}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <h3 class="btn row body-2 v-center relative" on:click>
    <span class="single-line mrg-a mrg--l mrg--r">{panel.name}</span>

    <div class="actions row v-center">
      <button class="reload btn mrg-a mrg--l" on:click|stopPropagation={onUpdateClick}>
        <Svg id="refresh" w="16" />
      </button>

      {#if onDelete}
        <button class="close btn mrg-xxl mrg--l" on:click|stopPropagation={onDelete}>
          <Svg id="close" w="12" />
        </button>
      {/if}
    </div>
  </h3>

  <div class="widget column c-black relative">
    {#if panel.sql.query}
      {#if type === PanelType.TABLE}
        <Table class="table-+QB5QE" columns={visibleColumns} data={__rows} />
      {:else if type === PanelType.TEXT}
        <Text column={panel.textValueColumn} data={__rows} {columns} />
      {:else if type === PanelType.CHART}
        <Chart columns={visibleColumns} data={__rows} {dateColumns} xAxisKey={panel.xAxisKey} />
      {:else if type === PanelType.PIE_CHART}
        <PieChart columns={visibleColumns} data={__rows} />
      {/if}

      {#if !__rows || !__rows.length}
        <div class="empty c-waterloo body-2">No data</div>
      {/if}
    {:else}
      <button class="query btn-1" on:click>Add query</button>
    {/if}
  </div>

  <Resizer onEnd={onResizeEnd} />
</div>

<style >.panel {
  background: var(--white);
  --color-hover: var(--green);
}
.panel_text {
  height: auto;
}

h3 {
  border-radius: 0;
  border-bottom: 1px solid var(--porcelain);
  padding: 8px;
}

.widget {
  /* padding: 0 16px 8px; */
  padding: 0 10px 10px;
  flex: 1;
  overflow: auto;
}

:global(.table-\+QB5QE) {
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

.actions {
  margin-right: 10px;
  --fill: var(--waterloo);
}

.close {
  --fill-hover: var(--red);
}

.query {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  --h-padding: 32px;
}</style>
