<script lang="ts">import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { downloadCsv } from 'san-webkit/lib/utils/csv';
import { PanelType } from './../../../lib/types';
import Table from './../../../lib/Table/index.svelte';
import Chart from './../../../lib/Chart/index.svelte';
import Text from './../../../lib/visualizations/Text.svelte';
import PieChart from './../../../lib/visualizations/PieChart/index.svelte';
import { showFullscreenDialog } from './FullscreenDialog.svelte';
export let panel;
export let columns;
export let dateColumns;
export let rows;
export let onFullscreenClick = showFullscreenDialog;
let downloadChart;

$: console.log(panel);

$: ({
  type
} = panel.settings);

$: visibleColumns = columns.filter(c => !c.isHidden);

function onDownload() {
  if (type === PanelType.TABLE) {
    downloadCsv(panel.name, columns, rows);
  } else if (type === PanelType.CHART) {
    downloadChart(panel.name);
  }
}</script>

<div class="row v-center">
  <div class="body-2 mrg-a mrg--r">{panel.name}</div>

  <div class="row">
    <button class="action btn-3" on:click={onDownload}><Svg id="download" w="17" /></button>
    <button class="action btn-3" on:click={() => onFullscreenClick($$props)}>
      <Svg id={onFullscreenClick === showFullscreenDialog ? 'fullscreen' : 'close'} w="14" />
    </button>
  </div>
</div>

{#if type === PanelType.TABLE}
  <Table columns={visibleColumns} data={rows} class="table-MKSuiB" />
{:else if type === PanelType.TEXT}
  <Text column={panel.textValueColumn} data={rows} {columns} placeholder="No column selected" />
{:else if type === PanelType.CHART}
  <Chart
    columns={visibleColumns}
    data={rows}
    {dateColumns}
    xAxisKey={panel.xAxisKey}
    bind:download={downloadChart} />
{:else if type === PanelType.PIE_CHART}
  <PieChart columns={visibleColumns} data={rows} />
{/if}

<style>
  .action {
    --fill: var(--waterloo);
    margin-left: 8px;
  }

  :global(.table-MKSuiB) {
    margin: 16px -16px 0;
    border-top: 1px solid var(--porcelain);
    width: calc(100% + 32px) !important;
  }
</style>
