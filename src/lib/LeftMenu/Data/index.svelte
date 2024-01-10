<script lang="ts">
  import { track } from 'webkit/analytics'
  import MenuItem from '../MenuItem.svelte'
  import Folder from '../Folder.svelte'
  import { queryClickhouseMetadata } from './api'
  import { onMount } from 'svelte'
  import { getSearch$Ctx } from '../Search.svelte'
  import PreviewTable from './PreviewTable.svelte'

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

  let viewed = null

  function onExploreTableClick(e, item) {
    const { right, top } = e.currentTarget.getBoundingClientRect()

    console.log({ right, top })

    viewed = {
      item,
      right,
      top,
    }
  }

  function onItemClick(item) {
    track.event('left_menu_item_click', {
      category: 'Interaction',
      tab: 'Data',

      type: item.type,
      id: item.id,
    })
  }
</script>

<h2 class="txt-m mrg-l mrg--b">Datasets</h2>

{#if filteredTables.length}
  <Folder title="Tables">
    {#each filteredTables as item}
      <MenuItem
        icon="table"
        dataActions
        on:click={() => onItemClick({ type: 'TABLE', id: item.n })}
        onExploreTableClick={(e) => onExploreTableClick(e, item)}
        isHoverActive={item === viewed?.item}
      >
        {item.n}
      </MenuItem>
    {/each}
  </Folder>
{/if}

<!-- {#if viewed} -->
<!--   <clickaway on:click={() => (viewed = null)} /> -->
<!--   <div class="explore border box" style="top:{viewed.top + 5}px;left:{viewed.right}px"> -->
<!--     <PreviewTable table={viewed.item.n} /> -->
<!--   </div> -->
<!-- {/if} -->

<style lang="scss">
  .explore {
    position: fixed;
    // left: 100px;
    width: 700px;
    height: 400px;
    // top: 50px;
  }

  clickaway {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
</style>
