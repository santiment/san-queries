<script lang="ts">
  import { onMount } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { newChartColors } from 'studio/Chart/colors'
  import { showParameterDialog } from '@/ParameterDialog.svelte'
  import {
    showAddParameterWalkthrough,
    showParameterOptionsWalkthrough,
  } from '@/walkthroughs/parameters'
  import Parameter, { getParameterSQL } from './Parameter.svelte'
  import Editor from '@/Editor/Async.svelte'
  import { updateThemeParameters } from '@/Editor/theme'
  import ExecuteButton from './ExecuteButton.svelte'
  import Info from './Info.svelte'
  import { mutateComputeRawClickhouseQuery } from '@/api/rawQuery'
  import { getParametersMap } from '@/utils/parameters'

  // export let data: SAN.Queries.SQLResult
  export let panel: SAN.Queries.Panel
  export let error: string
  export let data

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

    setValue(editor.getValue() + ' ' + getParameterSQL(parameter))
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

  function setValue(value) {
    editor.setValue(value)
    panel.sql.query = value
  }

  onMount(() => {
    showAddParameterWalkthrough()
  })

  function onExecuteClick(resolve) {
    const { query, parameters } = panel.sql
    return mutateComputeRawClickhouseQuery(query, getParametersMap(parameters)).then(
      (sqlResult) => {
        data = sqlResult
        error = ''
        panel.__rows = sqlResult.rows

        resolve()
      },
    )
  }

  function onQueryError(msg) {
    error = msg
  }
</script>

<div class="controls row mrg-m mrg--b" bind:this={controlsNode}>
  <ExecuteButton onClick={onExecuteClick} onError={onQueryError} />

  <button
    id="fw-add-parameter"
    class="add btn-2 btn--s row v-center nowrap"
    on:click={() => showParameterDialog({ onSubmit: onNewParameter })}>
    Add parameter
    <Svg id="braces" w="16" class="mrg-s mrg--l" />
  </button>

  <Info />

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
  <Editor class="$style.editor" bind:editor value={query} {parameters} {setValue} />

  {#if error}
    <div class="error caption c-red row">
      {error}
      <button class="close btn mrg-m mrg--l" on:click={() => (error = '')}>
        <Svg id="cross" w="12" />
      </button>
    </div>
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

  .close {
    --fill: var(--waterloo);
    align-self: flex-start;
  }
</style>
