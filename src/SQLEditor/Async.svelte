<script>
  import { onMount } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { showFullscreenDialog } from './FullscreenDialog.svelte'

  export let editor
  export let onFullscreenClick = showFullscreenDialog

  let Editor

  onMount(() => {
    import('./index.svelte').then((module) => {
      Editor = module.default
    })
  })
</script>

{#if Editor}
  <svelte:component this={Editor} {...$$props} bind:editor />

  <button class="fullscreen btn-3" on:click={() => onFullscreenClick($$props)}>
    <Svg id={onFullscreenClick === showFullscreenDialog ? 'fullscreen' : 'close'} w="14" />
  </button>
{:else}
  <div />
{/if}

<style>
  div {
    height: 100%;
  }

  .fullscreen {
    position: absolute;
    right: 16px;
    top: 16px;
    --fill: var(--waterloo);
  }
</style>
