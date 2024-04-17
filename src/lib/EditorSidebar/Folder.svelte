<script lang="ts">
  import { slide } from 'svelte/transition'
  import Svg from '$lib/ui/Svg.svelte'

  // Use Melt-ui Tree component
  let { title, folder }: { title: string; folder: any } = $props()

  let isOpened = $state(true)

  function onFolderClick() {
    isOpened = !isOpened
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<folder class="mb-2 flex flex-col">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <folder-head class="flex items-center justify-between gap-4">
    <button
      class="expand btn flex items-center gap-3"
      class:opened={isOpened}
      onclick={onFolderClick}
    >
      <Svg id="arrow-down" w="8" h="5" />

      {title}
      <!-- <Renamer {title} {onRename} bind:isRenaming /> -->
    </button>
  </folder-head>

  {#if isOpened}
    <section transition:slide={{ duration: 250 }}>
      <items class="column">
        <slot />
      </items>
    </section>
  {/if}
</folder>

<style lang="scss">
  .expand {
    flex: 1;
    --fill: var(--color, var(--black));
    word-break: break-all;
    min-height: 32px;
    max-width: calc(100% - 50px);
  }

  items {
    border-left: 1px solid var(--rhino);
    padding-left: 8px;
    margin: 4px 0 0 3.5px;
  }

  Svg {
    transition: transform 0.2s;
    transform: rotate(var(--rotate, -90deg));
  }

  .opened {
    --rotate: 0deg;
  }

  .rename {
    --expl-right: 0;
  }
</style>
