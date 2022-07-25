<script>
  import { onMount } from 'svelte'

  export let editor

  let Editor

  onMount(() => {
    import('./index.svelte').then((module) => {
      Editor = module.default
    })
  })
</script>

{#if Editor}
  <svelte:component this={Editor} {...$$props} bind:editor />
{:else}
  <div />
{/if}

<style>
  div {
    height: 100%;
  }
</style>
