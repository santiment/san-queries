<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { PanelType } from './types'

  let className = 'mrg-a mrg--l'
  export { className as class }
  export let visualizations
  export let visualization

  let isOpened = false

  function newVisualization(type, title) {
    visualizations.push({ type, title })
    visualizations = visualizations

    if (visualizations.length === 1) visualization = visualizations[0]

    isOpened = false
  }
</script>

<div class="relative {className}">
  <Tooltip on="click" position="bottom" class="$style.tooltip" bind:isOpened>
    <button slot="trigger" class="btn-2"
      >Create new visualization
      <Svg id="arrow-down" w="8" h="5" class="mrg-xl mrg--l" />
    </button>

    <div slot="tooltip" class="column">
      <button class="btn-ghost" on:click={() => newVisualization(PanelType.TABLE, 'My table')}
        >Table</button>
      <button class="btn-ghost" on:click={() => newVisualization(PanelType.CHART, 'My chart')}
        >Chart</button>
    </div>
  </Tooltip>
</div>

<style>
  button {
    --bg: var(--white);
    text-align: left;
  }

  .tooltip {
    padding: 8px;
    width: 100%;
  }
</style>
