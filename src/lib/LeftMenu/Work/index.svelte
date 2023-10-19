<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
</script>

<section class="row v-center justify mrg-s mrg--b">
  <h2 class="txt-m">My Workspace</h2>

  <actions class="row v-center">
    <button class="btn-3 expl-tooltip" aria-label="New folder">
      <Svg id="new-folder" w="12" />
    </button>
  </actions>
</section>

<Folder title="Let's get you started">
  {#each ['Data exploration', 'Commands', 'Functions', 'Get started dashboard'] as item, i}
    <MenuItem moreActions icon={i < 3 ? 'query' : 'dashboard'}>
      {item}
    </MenuItem>
  {/each}
</Folder>

<style lang="scss">
  .expl-tooltip {
    --expl-position-y: 4px;
    --expl-right: 0;
  }
</style>
