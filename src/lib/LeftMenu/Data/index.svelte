<script lang="ts">
  import Item from './Item.svelte'
  import Folder from '../Folder.svelte'
</script>

<h2 class="txt-m mrg-l mrg--b">Datasets</h2>

<Folder title="Let's get you started">
  {#each [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as item}
    <Item />
  {/each}
</Folder>

<style lang="scss">
</style>
