<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import { downloadCsv } from 'webkit/utils/csv'
  import { PanelType } from '@/types'
  import Table from '@/Table/index.svelte'
  // import Chart from '@/Chart/index.svelte'
  import { showFullscreenDialog } from './FullscreenDialog.svelte'

  export let visualization
  export let columns
  export let dateColumns
  export let rows
  export let visibleColumns
  export let onFullscreenClick = showFullscreenDialog

  let downloadChart

  $: ({ type } = visualization.settings)

  function onDownload() {
    if (type === PanelType.TABLE) {
      downloadCsv(visualization.name, columns, rows)
    } else if (type === PanelType.CHART) {
      downloadChart(visualization.name)
    }
  }
</script>

<div class="row v-center">
  <div class="body-2 mrg-a mrg--r">{visualization.name}</div>

  <div class="row">
    <button class="action btn-3" on:click={onDownload}><Svg id="download" w="17" /></button>
    <button class="action btn-3" on:click={() => onFullscreenClick($$props)}>
      <Svg id={onFullscreenClick === showFullscreenDialog ? 'fullscreen' : 'close'} w="14" />
    </button>
  </div>
</div>

{#if type === PanelType.TABLE}
  <Table columns={visibleColumns} data={rows} />
{:else}
  <!-- 
  <Chart
    columns={visibleColumns}
    data={rows}
    {dateColumns}
    xAxisKey={visualization.xAxisKey}
    bind:download={downloadChart} />
 -->
{/if}

<style>
  .action {
    --fill: var(--waterloo);
    margin-left: 8px;
  }
</style>
