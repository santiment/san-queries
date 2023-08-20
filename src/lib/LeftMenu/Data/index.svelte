<script lang="ts">
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
  import { queryClickhouseMetadata } from './api'
  import { onMount } from 'svelte'

  let tables = [] as { n: string }[]

  onMount(() => {
    queryClickhouseMetadata().then((data) => {
      tables = data.tables
    })
  })
</script>

<h2 class="txt-m mrg-l mrg--b">Datasets</h2>

<Folder title="Tables">
  {#each tables as item}
    <MenuItem icon="table" dataActions>
      {item.n}
    </MenuItem>
  {/each}
</Folder>

<style lang="scss">
</style>
