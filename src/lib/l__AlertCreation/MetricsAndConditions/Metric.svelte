<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'

  let className = 'mb-8'
  export { className as class }
  export let metric: { label: string }
  export let onClick: undefined | (() => void) = undefined

  $: ({ label } = metric)
</script>

<button class="btn column fluid border {className}" on:click={onClick}>
  <div class="row justify v-center mrg-xs mrg--b">
    {label}

    {#if onClick}
      <Svg id="pencil" w="14" />
    {/if}
  </div>

  <p class="caption c-waterloo text-left">
    Notify me when an asset’s {label} moves a certain way
  </p>
</button>

<style>
  button {
    padding: 8px 16px;
    fill: var(--green) !important;
    --border-hover: var(--green);
  }
</style>
