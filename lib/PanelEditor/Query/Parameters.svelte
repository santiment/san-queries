<script lang="ts">import { onMount } from 'svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { newChartColors } from 'san-studio/lib/Chart/colors';
import { showParameterDialog } from './../../../lib/ParameterDialog.svelte';
import { showAddParameterWalkthrough } from './../../../lib/walkthroughs/parameters';
import { getParameterSQL } from './Parameter.svelte';
import Info from './Info.svelte';
export let panel;
export let controller;

$: ({
  parameters
} = panel.sql);

$: colors = newChartColors(parameters);

function onNewParameter(parameter) {
  parameters.push(parameter);
  parameters = parameters;
  controller.onNewParameter(getParameterSQL(parameter));
}

function onParameterUpdate() {
  parameters = parameters;
}

function onParameterDelete(i) {
  parameters.splice(i, 1);
  parameters = parameters;
}

onMount(() => {
  showAddParameterWalkthrough();
});</script>

<button
  id="fw-add-parameter"
  class="btn-2 btn--s row v-center nowrap mrg-s mrg--r"
  on:click={() => showParameterDialog({ onSubmit: onNewParameter })}>
  Add parameter
  <Svg id="braces" w="16" class="mrg-s mrg--l" />
</button>

<Info />

<!-- 
{#each parameters as parameter, i}
  <Parameter
    class="parameter"
    {i}
    {parameter}
    color={colors[parameter.key]}
    onUpdate={onParameterUpdate}
    onDelete={onParameterDelete} />
{/each}
 -->
<style>
  button {
    --fill: var(--waterloo);
    --bg: var(--white);
    /* --color-hover: var(--green); */
    height: 32px;
    align-self: flex-start;
  }
</style>
