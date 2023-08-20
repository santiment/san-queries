<script lang="ts">
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
</script>

<Folder title="NFT tables">
  {#each [0, 0, 0, 0] as item}
    <MenuItem />
  {/each}
</Folder>

<Folder title="DEX trades tables">
  {#each [0, 0, 0, 0] as item}
    <MenuItem />
  {/each}
</Folder>

<style lang="scss">
</style>
