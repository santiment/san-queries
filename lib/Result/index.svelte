<script>import { onDestroy } from 'svelte';
import { PanelType } from './../../lib/types'; // import NewVisualization from './../../lib/NewVisualization.svelte'

import RowPanels from './../../lib/RowPanels.svelte';
import Visualizations from './../../lib/Visualizations.svelte';
import { getAppContext } from './../../lib/context';
import Options from './Options/index.svelte';
import Visualization from './Visualization.svelte';
const {
  dashboard$
} = getAppContext();
export let data;
export let headers = [];
export let rows = [];
export let columns;
export let dateColumns;
let dashboard = $dashboard$;
let visualizations = dashboard.panels;
let visualization = visualizations[0]; // NOTE: `$: visualization = dashboard?.panels[0]` doesn't allow to change `visualization` using bind:visualization [@vanguard]

let unsub = dashboard$.subscribe(value => {
  dashboard = value;
  visualizations = dashboard.panels;

  if (!visualizations.includes(visualization)) {
    visualization = visualizations[0];
  }
});

$: visualization && dateColumns && normalizeVisualization(dateColumns);

$: visibleColumns = getVisibleColumns(columns);

$: visualization && dashboard$.set(dashboard);

function normalizeVisualization(dateColumns) {
  if (visualization.settings.type !== PanelType.CHART) return;
  if (dateColumns.has(visualization.xAxisKey)) return;
  visualization.xAxisKey = [...dateColumns][0];
}

function getVisibleColumns(columns) {
  return columns.filter(column => !column.isHidden);
}

function onVisualizationDelete(i) {
  const removed = visualizations[i];
  if (removed === visualization) visualization = visualizations[(i || 1) - 1];
  if (removed.id) dashboard.removedPanels.push(removed);
  visualizations.splice(i, 1);
  visualizations = visualizations;
}

onDestroy(unsub);</script>

<div class="row v-center mrg-m mrg--b">
  <h2 class="body-2 mrg-xl mrg--r">Query results</h2>

  <Visualizations bind:visualization {visualizations} {onVisualizationDelete} />

  <!-- <NewVisualization bind:visualization bind:visualizations={$dashboard$.panels} /> -->
</div>

{#if visualization}
  <RowPanels class="result-ldRPUS">
    <svelte:fragment slot="left">
      {#if data}
        <Visualization {visualization} {columns} {rows} {dateColumns} {visibleColumns} />
      {:else}
        <div class="column hv-center">
          <h2 class="body-2 txt-b">No data</h2>
          <p class="mrg-xs mrg--t">Run your query first</p>
        </div>
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="right">
      <Options bind:visualization bind:columns {headers} {dateColumns} />
    </svelte:fragment>
  </RowPanels>
{:else}
  <div class="border column hv-center">
    <h2 class="body-2 txt-b">No visualization</h2>
    <p class="mrg-xs mrg--t">Create and select visualization first</p>
  </div>
{/if}

<style>
  :global(.result-ldRPUS) {
    flex: 1;
    min-height: 0;
  }

  .column {
    min-height: 284px;
    flex: 1;
  }
</style>
