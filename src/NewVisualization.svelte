<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'

  let className = 'mrg-a mrg--l'
  export { className as class }

  let isOpened = false

  function newVisualization() {}
</script>

<Tooltip on="click" position="bottom" bind:isOpened>
  <button slot="trigger" class="btn-2 {className}"
    >Create new visualization
    <Svg id="arrow-down" w="8" h="5" class="mrg-xl mrg--l" />
  </button>

  <div slot="tooltip" class="tooltip column">
    <button class="btn-ghost" on:click={() => newVisualization('')}>Table</button>
    <button class="btn-ghost" on:click={() => newVisualization('')}>Chart</button>
  </div>
</Tooltip>

<style>
  button {
    --bg: var(--white);
    text-align: left;
  }

  .tooltip {
    padding: 8px;
    width: 150px;
  }
</style>
