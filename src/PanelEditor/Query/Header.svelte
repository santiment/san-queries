<script lang="ts">
  import { onMount } from 'svelte'
  import { showParameterOptionsWalkthrough } from '@/walkthroughs/parameters'
  import { queryComputeRawClickhouse } from '@/api/query/raw'
  import { getParametersMap } from '@/utils/parameters'
  import ExecuteButton from './ExecuteButton.svelte'
  import Parameters from './Parameters.svelte'

  export let panel
  export let error = ''
  export let controller
  export let onData

  let controlsNode

  function onExecuteClick(resolve) {
    const { query, parameters } = panel.sql

    return queryComputeRawClickhouse(query, getParametersMap(parameters)).then((sqlResult) => {
      onData(sqlResult)

      error = ''
      resolve()
    })
  }

  function onQueryError(msg) {
    error = msg
  }

  onMount(() => {
    showParameterOptionsWalkthrough(controlsNode)
  })
</script>

<div class="controls row mrg-m mrg--b" bind:this={controlsNode}>
  <ExecuteButton onClick={onExecuteClick} onError={onQueryError} />

  <Parameters bind:panel {controller} />
</div>

<style>
  .controls {
    gap: 8px;
    flex-wrap: wrap;
  }
</style>
