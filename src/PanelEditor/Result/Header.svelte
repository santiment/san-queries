<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { PanelType } from '@/types'

  export let panel

  let isOpened = false

  function onSelect(result: PanelType) {
    panel.settings.type = result
    isOpened = false
  }
</script>

<div class="row v-center mrg-m mrg--b">
  <h2 class="body-2 mrg-xl mrg--r">Query results</h2>

  <div class="relative mrg-a mrg--l">
    <Tooltip on="click" position="bottom" class="$style.tooltip" bind:isOpened>
      <button slot="trigger" class="btn-2">
        Change visualization type
        <Svg id="arrow-down" w="8" h="5" class="mrg-xl mrg--l" />
      </button>

      <div slot="tooltip" class="column">
        <button class="btn-ghost" on:click={() => onSelect(PanelType.TABLE)}>Table</button>

        <button class="btn-ghost" on:click={() => onSelect(PanelType.TEXT)}>Text</button>

        <button class="btn-ghost" on:click={() => onSelect(PanelType.CHART)}>Chart</button>

        <button class="btn-ghost" on:click={() => onSelect(PanelType.PIE_CHART)}>Pie Chart</button>
      </div>
    </Tooltip>
  </div>
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
