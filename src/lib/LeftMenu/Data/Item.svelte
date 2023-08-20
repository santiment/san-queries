<script lang="ts">
  import Svg, { type Props } from 'webkit/ui/Svg/svelte'

  export let icon = '' as Props['id']

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
      <button class="btn-3"><Svg id="external-link" w="12" /></button>
      <button class="btn-3"><Svg id="vert-dots" w="3" h="12" /></button>
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
  }
</style>
