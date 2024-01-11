<script lang="ts">
  import { slide } from 'svelte/transition'
  import Svg from 'webkit/ui/Svg/svelte'
  import Renamer from '$lib/Renamer.svelte'

  export let title: string
  export let folder: any = undefined

  let isOpened = true
  let isHovered = false
  let isRenaming = false

  function onFolderClick() {
    if (isRenaming) return

    isOpened = !isOpened
  }

  function onRenameClick() {
    isRenaming = true
  }

  function onRename(value: string) {
    const target = folder.source || folder
    target.name = value
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<folder class="column mrg-s mrg--b" on:dragover on:dragend on:drop>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <folder-head
    class="row v-center justify gap-l"
    on:mouseenter={() => (isHovered = true)}
    on:mouseleave={() => (isHovered = false)}
  >
    <button class="expand btn row v-center gap-m" class:opened={isOpened} on:click={onFolderClick}>
      <Svg id="arrow-down" w="8" h="5" />

      <Renamer {title} {onRename} bind:isRenaming />
    </button>

    <!-- 
    {#if isHovered || isRenaming}
      <button
        class="rename btn-3"
        class:expl-tooltip={!isRenaming}
        aria-label="Rename folder"
        on:click={onRenameClick}
      >
        <Svg id="pencil" w="12" />
      </button>
    {/if}
 -->
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
