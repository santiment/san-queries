<script lang="ts">
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
</script>

<h2 class="txt-m mrg-l mrg--b">My Workspace</h2>

<Folder title="Let's get you started">
  {#each ['Data exploration', 'Commands', 'Functions', 'Get started dashboard'] as item, i}
    <MenuItem moreActions icon={i < 3 ? 'query' : 'dashboard'}>
      {item}
    </MenuItem>
  {/each}
</Folder>

<style lang="scss">
</style>
