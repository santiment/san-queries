<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Item from './Item.svelte'
</script>

<h2 class="txt-m mrg-l mrg--b">My Workspace</h2>

<folder class="column">
  <button class="expand btn row v-center gap-m">
    <Svg id="arrow-down" w="8" h="5" /> Let's get you started
  </button>

  <section class="column mrg-s mrg--t">
    {#each [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as item}
      <Item />
    {/each}
  </section>
</folder>

<style lang="scss">
  // folder {
  //   &::before {
  //     content: '';
  //     display: block;
  //   }
  // }

  .expand {
    --fill: var(--black);
  }

  section {
    border-left: 1px solid var(--rhino);
    margin-left: 3.5px;
    padding-left: 8px;
  }
</style>
