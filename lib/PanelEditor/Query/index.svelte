<script lang="ts">import SQLEditor from './SQLEditor.svelte';
import ExecuteButton from './ExecuteButton.svelte';
import Parameters from './Parameters.svelte';
import { mutateComputeRawClickhouseQuery } from './../../../lib/api/query/raw';
import { getParametersMap } from './../../../lib/utils/parameters';
import { onMount } from 'svelte';
import { showParameterOptionsWalkthrough } from './../../../lib/walkthroughs/parameters';
import Parameter from './Parameter.svelte';
import { newChartColors } from 'san-studio/lib/Chart/colors';
export let panel;
export let editor;
export let error;
export let controller;
let controlsNode;

$: ({
  parameters
} = panel.sql);

$: colors = newChartColors(parameters);

function onExecuteClick(resolve) {
  const {
    query,
    parameters
  } = panel.sql;
  return mutateComputeRawClickhouseQuery(query, getParametersMap(parameters)).then(sqlResult => {
    controller.onData(sqlResult);
    error = '';
    resolve();
  });
}

function onQueryError(msg) {
  error = msg;
}

onMount(() => {
  showParameterOptionsWalkthrough(controlsNode);
});

function onParameterUpdate() {
  parameters = parameters;
}

function onParameterDelete(i) {
  parameters.splice(i, 1);
  parameters = parameters;
}</script>

<!-- 
<RowPanels class="">
  <svelte:fragment slot="left">
    <SQLEditor bind:panel bind:editor bind:error {controller} />
  </svelte:fragment>

  <svelte:fragment slot="right">123</svelte:fragment>
</RowPanels>
 -->

<div class="row fluid mrg-xl mrg--b">
  <SQLEditor bind:panel bind:editor bind:error {controller} />

  <div class="right border mrg-s mrg--l relative">
    <div class="top row mrg-xxl mrg--b">
      <ExecuteButton onClick={onExecuteClick} onError={onQueryError} />

      <Parameters bind:panel {controller} />
    </div>

    {#if !parameters.length}
      <div class="empty body-2 txt-center c-waterloo">No parameters added</div>
    {/if}

    <div class="parameters column fluid" bind:this={controlsNode}>
      {#each parameters as parameter, i}
        <Parameter
          class="parameter mrg-s mrg--b"
          {i}
          {parameter}
          color={colors[parameter.key]}
          onUpdate={onParameterUpdate}
          onDelete={onParameterDelete} />
      {/each}
    </div>
  </div>
</div>

<style>
  .right {
    min-width: 320px;
  }

  .top {
    padding: 16px 16px 0;
  }

  .parameters {
    position: absolute;
    top: 80px;
    bottom: 0;
    padding: 0 16px 16px;
    overflow: auto;
  }

  .empty {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
