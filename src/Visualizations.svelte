<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { FeatureWalkthrough$ } from 'webkit/ui/FeatureWalkthrough/context'
  import { PanelType } from '@/types'
  import { showResultVisualizationsWalkthrough } from './walkthroughs/visualizations'

  export let visualizations = []
  export let visualization: SAN.Queries.PanelType

  let visualizationsNode

  $: if (visualizationsNode) showResultVisualizationsWalkthrough(visualizationsNode)
</script>

<div id="fw-visulizations-select" class="row" bind:this={visualizationsNode}>
  {#each visualizations as item}
    <button
      class="btn-2 mrg-s mrg--r row v-center"
      class:active={visualization === item}
      on:click={() => (visualization = item)}>
      <Svg id={item.type} w="16" class="mrg-s mrg--r" />
      {item.title}
    </button>
  {/each}
</div>

<style>
  button {
    border-radius: 16px;
    --bg: var(--white);
    --fill: var(--waterloo);
    --h-padding: 12px;
  }

  .active {
    --bg: var(--green-light-1);
    --color: var(--green);
    --fill: var(--green);
    border-color: var(--green);
  }
</style>
