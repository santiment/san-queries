<script lang="ts">
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
</script>

<h2 class="txt-m mrg-l mrg--b">My Workspace</h2>

<Folder title="Let's get you started">
  {#each [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as item}
    <MenuItem moreActions />
  {/each}
</Folder>

<style lang="scss">
</style>
