<script lang="ts">
  import Item from '../Work/Item.svelte'
  import Folder from '../Folder.svelte'
</script>

<Folder title="NFT tables">
  {#each [0, 0, 0, 0] as item}
    <Item />
  {/each}
</Folder>

<Folder title="DEX trades tables">
  {#each [0, 0, 0, 0] as item}
    <Item />
  {/each}
</Folder>

<style lang="scss">
</style>
