<script lang="ts">
  import { DASHBOARDS, DEX_TABLES, NFTS } from './data'
  import Folder from '../Folder.svelte'
  import Item from '../WorkTab/Item.svelte'
  import { applySearch } from '../WorkTab/search'

  let { search = '' } = $props()

  let tree = {
    children: [
      { type: 'folder', name: 'How to get started', children: DASHBOARDS },
      { type: 'folder', name: 'NFT Tables', children: NFTS },
      { type: 'folder', name: 'DEX Trades Tables', children: DEX_TABLES },
    ],
  }

  let filteredTree = $derived(
    applySearch(search, tree.children, filterTree),
  ) as (typeof tree)['children']

  function filterTree(input: RegExp, worktree: (typeof tree)['children']) {
    return worktree
      .map((item) => {
        const children = item.children.filter((child) => child.name.search(input) >= 0)
        if (children.length) {
          return { ...item, children, source: item }
        }
        return null
      })
      .filter(Boolean)
  }
</script>

{#each filteredTree as item, i (item)}
  {@const { type } = item}
  {#if type === 'folder'}
    <Folder title={item.name} folder={item}>
      {#each item.children as child (child)}
        <Item item={child} parent={item} />
      {/each}
    </Folder>
  {/if}
{/each}
