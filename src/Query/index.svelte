<script lang="ts">
  import { onMount } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { newChartColors } from 'studio/Chart/colors'
  import { showParameterDialog } from '@/ParameterDialog.svelte'
  import {
    showAddParameterWalkthrough,
    showParameterOptionsWalkthrough,
  } from '@/walkthroughs/parameters'
  import Parameter from './Parameter.svelte'
  import Editor from '@/Editor/Async.svelte'
  import { updateThemeParameters } from '@/Editor/theme'

  export let data: SAN.Queries.SQLResult
  export let panel: SAN.Queries.Panel
  export let error: string

  let controlsNode
  let editor

  $: console.log(editor)
  $: ({ query, parameters } = panel.sql)
  $: colors = newChartColors(parameters)
  $: if (controlsNode) showParameterOptionsWalkthrough(controlsNode)
  $: if (editor) editor.onDidBlurEditorText(onBlur)
  $: updateParametersTheme(parameters)

  function updateParametersTheme(parameters) {
    updateThemeParameters(parameters)
  }

  function onNewParameter(parameter) {
    parameters.push(parameter)
    parameters = parameters
  }

  function onParameterUpdate() {
    parameters = parameters
  }

  function onParameterDelete(i) {
    parameters.splice(i, 1)
    parameters = parameters
  }

  function onBlur() {
    panel.sql.query = editor.getValue()
  }

  onMount(() => {
    showAddParameterWalkthrough()
  })
</script>

<div class="controls row mrg-m mrg--b" bind:this={controlsNode}>
  <button
    id="fw-add-parameter"
    class="add btn-2 btn--s row v-center nowrap"
    on:click={() => showParameterDialog({ onSubmit: onNewParameter })}>
    Add parameter
    <Svg id="braces" w="16" class="mrg-s mrg--l" />
  </button>

  {#each parameters as parameter, i}
    <Parameter
      class="parameter"
      {i}
      {parameter}
      color={colors[parameter.key]}
      onUpdate={onParameterUpdate}
      onDelete={onParameterDelete} />
  {/each}
</div>

<div class="query border mrg-l mrg--b relative">
  <Editor class="$style.editor" bind:editor value={query} {parameters} />

  {#if error}
    <div class="error caption c-red">{error}</div>
  {/if}
</div>

<style>
  .controls {
    gap: 8px;
    flex-wrap: wrap;
  }

  .query {
    min-height: 284px;
  }

  .add {
    --fill: var(--waterloo);
    --bg: var(--white);
    /* --color-hover: var(--green); */
    height: 32px;
    align-self: flex-start;
  }

  .error {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 8px;
    background: var(--red-light-1);
    color: var(--red);
    width: 100%;
  }
</style>
