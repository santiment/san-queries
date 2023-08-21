<script lang="ts">
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
  import { queryClickhouseMetadata } from './api'
  import { onMount } from 'svelte'
  import { getSearch$Ctx } from '../Search.svelte'

  const { search$ } = getSearch$Ctx()

  let tables = [] as { n: string }[]

  $: filteredTables = search$.apply($search$, tables, filterTables)

  function filterTables(input: RegExp, table: (typeof tables)[number]) {
    return table.n.search(input) >= 0
  }

  onMount(() => {
    queryClickhouseMetadata().then((data) => {
      tables = data.tables
    })
  })
</script>

<h2 class="txt-m mrg-l mrg--b">Datasets</h2>

{#if filteredTables.length}
  <Folder title="Tables">
    {#each filteredTables as item}
      <MenuItem icon="table" dataActions>
        {item.n}
      </MenuItem>
    {/each}
  </Folder>
{/if}

<style lang="scss">
</style>
