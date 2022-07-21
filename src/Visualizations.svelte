<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { showResultVisualizationsWalkthrough } from './walkthroughs/visualizations'

  export let visualizations = [] as SAN.Queries.DashboardPanel[]
  export let visualization: SAN.Queries.DashboardPanel
  export let onVisualizationDelete

  let visualizationsNode

  $: if (visualizationsNode) showResultVisualizationsWalkthrough(visualizationsNode)
</script>

<div id="fw-visulizations-select" class="row" bind:this={visualizationsNode}>
  {#each visualizations as item, i}
    <button
      class="btn-2 mrg-s mrg--r row v-center"
      class:active={visualization === item}
      on:click={() => (visualization = item)}>
      <Svg id={item.type.toLowerCase()} w="16" class="mrg-s mrg--r" />
      {item.name}

      <!-- 
      <div class="delete btn" on:click|stopPropagation={() => onVisualizationDelete(i)}>
        <Svg id="cross" w="8" />
      </div>
 -->
    </button>
  {/each}
</div>

<style>
  button {
    border-radius: 16px;
    --bg: var(--white);
    --fill: var(--waterloo);
    --h-padding: 12px;
    padding-right: 9px;
  }

  .active {
    --bg: var(--green-light-1);
    --color: var(--green);
    --fill: var(--green);
    border-color: var(--green);
  }

  .delete {
    margin-left: 10px;
    --fill-hover: var(--red);
    padding: 0 3px;
  }
</style>
