<script>
  import Svg from 'webkit/ui/Svg/svelte'

  export let visualizations = [
    {
      type: 'table',
      title: 'My table',
    },
    { type: 'chart', title: 'My chart' },
  ]
  export let visualization = visualizations[0]
</script>

<div class="row">
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
