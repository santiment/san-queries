<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { PanelType } from '@/types'
  import { newPanel } from '@/stores/dashboard'
  import Panel from './Panel.svelte'

  export let dashboard
  export let selectedPanel

  let isOpened = false

  $: ({ panels } = dashboard)
  $: isSinglePanel = panels.length === 1

  function onSelect(type) {
    const panel = newPanel(`My panel (${type.toLowerCase()})`, type)
    panel.__scrollOnMount = true

    panels.push(panel)
    panels = panels
    isOpened = false
  }

  function onPanelDelete(panel) {
    panels = panels.filter((v) => v !== panel)
  }

  function onExecuteClick(item) {
    console.log(item)
  }

  function onQueryError() {}
</script>

<div class="row mrg-l mrg--b justify">
  <div class="btn-1">Get data</div>

  <div class="relative mrg-a mrg--l">
    <Tooltip on="click" position="bottom" class="$style.tooltip" bind:isOpened>
      <button slot="trigger" class="new btn-2">
        New panel
        <Svg id="arrow-down" w="8" h="5" class="mrg-xl mrg--l" />
      </button>

      <div slot="tooltip" class="column">
        <button class="btn-ghost" on:click={() => onSelect(PanelType.TABLE)}>Table</button>
        <button class="btn-ghost" on:click={() => onSelect(PanelType.CHART)}>Chart</button>
      </div>
    </Tooltip>
  </div>
</div>

<section>
  {#each panels as panel}
    <Panel
      {panel}
      on:click={() => (selectedPanel = panel)}
      onDelete={isSinglePanel ? null : () => onPanelDelete(panel)} />
  {/each}
</section>

<style>
  section {
    gap: 24px;
    display: grid;
  }

  .new {
    background: var(--white);
  }

  .tooltip {
    padding: 8px;
    width: 100%;
  }
</style>
