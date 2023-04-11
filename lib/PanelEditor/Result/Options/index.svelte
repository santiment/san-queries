<script>import Field from 'san-webkit/lib/ui/Field/svelte';
import { PanelType } from './../../../types';
import TitleOption from './Title.svelte';
import FormatOption from './Format.svelte';
import VisibilityOption from './Visibility.svelte';
import ChartXAxisOption from './ChartXAxis.svelte';
import ChartNodeStyleOption from './ChartNodeStyle.svelte';
import TextValueOption from './TextValueOption.svelte';
export let panel;
export let headers;
export let columns;
export let dateColumns;

$: isChartVisualization = panel.settings.type === PanelType.CHART;

$: isTextVisualization = panel.settings.type === PanelType.TEXT;</script>

<h3 class="body-2">Options</h3>

<div class="scroll">
  <Field title="Visualization name" placeholder="My table" bind:value={panel.name} />

  {#if isChartVisualization && columns.length}
    <ChartXAxisOption bind:panel {columns} {dateColumns} />
  {/if}

  {#if isTextVisualization && columns.length}
    <TextValueOption bind:panel {columns} />
  {/if}

  {#each columns as column, i}
    <TitleOption bind:column {i} {headers} />
    <FormatOption bind:column {i} />

    {#if !isTextVisualization}
      <VisibilityOption bind:column {i} {dateColumns} {isChartVisualization} />
    {/if}

    {#if isChartVisualization && !dateColumns.has(column)}
      <ChartNodeStyleOption bind:column {columns} {i} />
    {/if}
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
