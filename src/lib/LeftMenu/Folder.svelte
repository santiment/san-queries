<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { slide } from 'svelte/transition'

  export let title: string

  let isOpened = true
  let isHovered = false
  let isRenaming = false

  function onFolderClick() {
    if (isRenaming) return

    isOpened = !isOpened
  }

  function onRenameClick(e: Event) {
    const folderNode = (e.currentTarget as HTMLElement).parentNode
    const titleNode = folderNode?.firstElementChild?.lastElementChild

    if (!titleNode) return

    isRenaming = true
  }

  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        return (e.currentTarget as HTMLInputElement).blur()
    }
  }

  function onFocus(node: HTMLElement) {
    const selection = window.getSelection()
    if (!selection) return

    const range = document.createRange()
    selection.removeAllRanges()
    range.selectNodeContents(node)
    selection.addRange(range)
  }

  function onBlur(e: Event) {
    isRenaming = false
    const titleNode = e.currentTarget as HTMLElement
    title = (titleNode.textContent as string).trim()
  }
</script>

<folder class="column mrg-s mrg--b">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <folder-head
    class="row v-center justify gap-l"
    on:mouseenter={() => (isHovered = true)}
    on:mouseleave={() => (isHovered = false)}
  >
    <button class="expand btn row v-center gap-m" class:opened={isOpened} on:click={onFolderClick}>
      <Svg id="arrow-down" w="8" h="5" />
      <!-- svelte-ignore a11y-no-static-element-interactions -->

      {#if isRenaming}
        <!-- svelte-ignore a11y-autofocus -->
        <span
          contenteditable="true"
          on:keydown={onKeyDown}
          on:blur={onBlur}
          use:onFocus
          autofocus={true}
        >
          {title}
        </span>
      {:else}
        {title}
      {/if}
    </button>

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
    --fill: var(--black);
    word-break: break-all;
    min-height: 32px;
    max-width: calc(100% - 42px);
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
