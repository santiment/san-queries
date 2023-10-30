<script lang="ts">
  import Svg, { type Props } from 'webkit/ui/Svg/svelte'

  import { noop } from 'webkit/utils'
  import Tooltip from 'webkit/ui/Tooltip'

  export let icon = '' as Props['id']
  export let moreActions = false
  export let dataActions = false
  export let draggable = false

  export let onRenameClick = noop
  export let onDuplicateClick = noop
  export let onDeleteClick = noop

  let isHovered = false
  let isMenuOpened = false

  $: if (!isMenuOpened) isHovered = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<article
  class="btn row gap-s v-center"
  class:hovered={isMenuOpened}
  on:click
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = isMenuOpened)}
  on:dragstart
  on:dragend
  {draggable}
>
  {#if icon}
    <Svg id={icon} w="12" />
  {/if}

  <span class="single-line">
    <slot>Data exploration</slot>
  </span>

  {#if isHovered}
    <actions class="row">
      {#if dataActions}
        <button class="btn-3"><Svg id="eye" w="15" h="10" /></button>
        <button class="btn-3 expl-tooltip" aria-label="Add to Favourites"
          ><Svg id="star-filled" w="12" /></button
        >
        <button class="copy btn-3 expl-tooltip" aria-label="Copy to editor">
          <Svg id="right-arrow" w="11" h="6" />
        </button>
      {:else}
        <button class="btn-3 expl-tooltip" aria-label="Open in a new tab">
          <Svg id="external-link" w="12" />
        </button>
      {/if}

      {#if moreActions}
        <Tooltip let:trigger on="click" position="bottom" clickaway bind:isOpened={isMenuOpened}>
          <button use:trigger class="more btn-3">
            <Svg id="vert-dots" w="3" h="12" />
          </button>

          <svelte:fragment slot="tooltip">
            <button class="btn-ghost" on:click={onRenameClick}>Rename</button>
            <button class="btn-ghost" on:click={onDuplicateClick}>Duplicate</button>
            <button class="btn-ghost" on:click={onDeleteClick}>Delete</button>
          </svelte:fragment>
        </Tooltip>
      {/if}
    </actions>
  {/if}
</article>

<style lang="scss">
  article {
    padding: 6px 10px;
    --bg-hover: var(--white);
  }

  actions {
    margin: -6px -10px -6px auto;
    fill: var(--waterloo);
  }

  .copy {
    --expl-right: 0;
    --expl-left: unset;
  }

  Tooltip {
    padding: 8px;
  }

  .hovered {
    --bg: var(--white);

    .more {
      fill: var(--green);
    }
  }
</style>
