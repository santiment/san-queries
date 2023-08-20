<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { slide } from 'svelte/transition'

  export let title: string

  let isOpened = true

  function onFolderClick() {
    isOpened = !isOpened
  }
</script>

<folder class="column mrg-s mrg--b">
  <button class="expand btn row v-center gap-m" class:opened={isOpened} on:click={onFolderClick}>
    <Svg id="arrow-down" w="8" h="5" />
    {title}
  </button>

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
    height: 32px;
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
</style>
