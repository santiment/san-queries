<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { slide } from 'svelte/transition'

  export let title: string
  export let isOpened = true

  function onClick() {
    isOpened = !isOpened
  }
</script>

<section>
  <button class="btn txt-m row v-center gap-m" class:opened={isOpened} on:click={onClick}>
    <Svg id="arrow-down" w="8" h="5" />
    {title}
  </button>

  {#if isOpened}
    <controls class="column gap-l mrg-l mrg--t" transition:slide={{ duration: 250 }}>
      <slot />
    </controls>
  {/if}
</section>

<style>
  section {
    padding: 16px;
    background: var(--athens);
    border-radius: 6px;
  }

  .opened {
    --rotate: 0deg;
  }

  Svg {
    transition: transform 0.2s;
    transform: rotate(var(--rotate, -90deg));
  }
</style>
