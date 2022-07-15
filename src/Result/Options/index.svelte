<script>
  import Field from 'webkit/ui/Field/svelte'
  import { PanelType } from '@/types'
  import TitleOption from './Title.svelte'
  import FormatOption from './Format.svelte'
  import VisibilityOption from './Visibility.svelte'
  import ChartXAxisOption from './ChartXAxis.svelte'

  export let visualization
  export let headers
  export let columns
  export let dateColumns

  $: isChartVisualization = visualization.type === PanelType.CHART
</script>

<h3 class="body-2">Options</h3>

<div class="scroll">
  <Field title="Visualization name" placeholder="My table" bind:value={visualization.title} />

  {#if isChartVisualization && columns.length}
    <ChartXAxisOption bind:visualization {columns} {dateColumns} />
  {/if}

  {#each columns as column, i}
    <TitleOption bind:column {i} {headers} />
    <FormatOption bind:column {i} />
    <VisibilityOption bind:column {i} {dateColumns} {isChartVisualization} />
  {/each}
</div>

<style>
  h3 {
    border-bottom: 1px solid var(--porcelain);
    padding: 0 0 16px;
  }

  .scroll {
    flex: 1;
    --max-height: 446px;
  }
</style>
