<script lang="ts">
  import { switchMap, tap } from 'rxjs'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import Svg from '$lib/ui/Svg.svelte'
  import { queryClickhouseMetadata } from './api'
  import Folder from '../Folder.svelte'
  import { applySearch } from '../WorkTab/search'

  let { search = '' } = $props()

  let tables = $state.raw([] as { n: string }[])
  let tree = $derived({
    children: [{ type: 'folder', name: 'Tables', children: tables }],
  })

  function onItemClick(item: (typeof tables)[number]) {
    console.log(item)
  }

  let filteredTree = $derived(
    applySearch(search, tree.children, filterTree),
  ) as (typeof tree)['children']

  function filterTree(input: RegExp, worktree: (typeof tree)['children']) {
    return worktree
      .map((item) => {
        const children = item.children.filter((child) => child.n.search(input) >= 0)
        if (children.length) {
          return { ...item, children, source: item }
        }
        return null
      })
      .filter(Boolean)
  }

  const loadTables = useObserveFnCall(() =>
    switchMap(() => queryClickhouseMetadata()().pipe(tap((data) => (tables = data.tables)))),
  )
  $effect(() => {
    loadTables()
  })
</script>

<h2 class="mb-4 font-medium">Datasets</h2>

{#each filteredTree as item, i (item)}
  {@const { type } = item}
  {#if type === 'folder'}
    <Folder title={item.name} folder={item}>
      {#each item.children as child (child)}
        <button
          class="group/item relative flex items-center gap-2 rounded px-2.5 py-1.5 text-left hover:bg-white"
          onclick={() => onItemClick(child)}
        >
          <Svg id="table" w="12"></Svg>
          <span class="flex-1 single-line">
            {child.n}
          </span>
        </button>
      {/each}
    </Folder>
  {/if}
{/each}
