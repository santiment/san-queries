<script lang="ts">
  import Svg, { type Props } from 'webkit/ui/Svg/svelte'

  export let icon = '' as Props['id']
  export let moreActions = false
  export let dataActions = false

  let isHovered = false
</script>

<article
  class="btn row gap-s v-center"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
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
        <button class="btn-3"><Svg id="vert-dots" w="3" h="12" /></button>
      {/if}
    </actions>
  {/if}
</article>

<style>
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
</style>
