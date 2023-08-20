<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { slide } from 'svelte/transition'

  export let title: string

  let isOpened = true

  function onFolderClick() {
    isOpened = !isOpened
  }
</script>

<folder class="column">
  <button class="expand btn row v-center gap-m" class:opened={isOpened} on:click={onFolderClick}>
    <Svg id="arrow-down" w="8" h="5" />
    {title}
  </button>

  {#if isOpened}
    <section>
      <items class="column" transition:slide={{ duration: 250 }}>
        <slot />
      </items>
    </section>
  {/if}
</folder>

<style lang="scss">
  .expand {
    --fill: var(--black);
  }

  section {
    padding-top: 8px;
  }

  items {
    border-left: 1px solid var(--rhino);
    margin-left: 3.5px;
    padding-left: 8px;
  }

  Svg {
    transition: transform 0.2s;
    transform: rotate(var(--rotate, -90deg));
  }

  .opened {
    --rotate: 0deg;
  }
</style>
