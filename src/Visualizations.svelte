<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import { FeatureWalkthrough$ } from 'webkit/ui/FeatureWalkthrough/context'

  export let visualizations = [
    {
      type: 'table',
      title: 'My table',
    },
    { type: 'chart', title: 'My chart' },
  ]
  export let visualization = visualizations[0]

  let visualizationsNode

  $: if (visualizationsNode) {
    const node = visualizationsNode.firstElementChild

    // false &&
    FeatureWalkthrough$.show({
      id: 'fw-visulizations-select',
      title: "Result's visualizations",
      description: `<p class="mrg-l mrg--b">Change between visualizations and customize them inside the option's pane on the right</p>`,
    })
  }
</script>

<div id="fw-visulizations-select" class="row" bind:this={visualizationsNode}>
  {#each visualizations as item}
    <button
      class="btn-2 mrg-s mrg--r row v-center"
      class:active={visualization === item}
      on:click={() => (visualization = item)}>
      <Svg id={item.type} w="16" class="mrg-s mrg--r" />
      {item.title}</button>
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
