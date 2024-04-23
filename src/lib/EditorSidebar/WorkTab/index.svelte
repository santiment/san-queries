<script lang="ts">
  import { switchMap, tap } from 'rxjs'
  import { page as page$ } from '$app/stores'
  import { queryGetMostRecent, type TEntity } from '$routes/explorer/api'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import Folder from '../Folder.svelte'
  import Item from './Item.svelte'
  import { applySearch } from './search'
  import { useEditorSidebarCtx } from '../ctx'
  import { useObserve } from 'svelte-runes'

  let { search = '' } = $props()

  const { refreshDashboards$, refreshQueries$ } = useEditorSidebarCtx()

  type TDashboards = (TEntity & { type: 'dashboard' })[]
  type TQueries = (TEntity & { type: 'query' })[]
  let dashboards = $state.frozen([] as TDashboards)
  let queries = $state.frozen([] as TQueries)

  let tree = $derived({
    children: [
      { type: 'folder', name: 'My Dashboards', children: dashboards },
      { type: 'folder', name: 'My Queries', children: queries },
    ],
  })

  let pathname = $derived($page$.url.pathname.slice(1))
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

  const loadQueries = useObserveFnCall(() =>
    switchMap(() =>
      queryGetMostRecent()({ currentUserDataOnly: true, types: ['QUERY'] }).pipe(
        tap((data) => (queries = data.items as TQueries)),
      ),
    ),
  )

  const loadDashboards = useObserveFnCall(() =>
    switchMap(() =>
      queryGetMostRecent()({ currentUserDataOnly: true, types: ['DASHBOARD'] }).pipe(
        tap((data) => (dashboards = data.items as TDashboards)),
      ),
    ),
  )

  useObserve(() => refreshDashboards$.pipe(tap(loadDashboards)))
  useObserve(() => refreshQueries$.pipe(tap(loadQueries)))

  $effect(() => {
    loadQueries()
    loadDashboards()
  })
</script>

<h2 class="mb-4 font-medium">My Workspace</h2>

{#each filteredTree as item, i (item)}
  {@const { type } = item}
  {#if type === 'folder'}
    <Folder title={item.name} folder={item}>
      {#each item.children as child, i (child)}
        <Item
          idx={i}
          item={child}
          parent={item}
          onclick={() => onItemClick(child)}
          isActive={pathname.startsWith(child.type) && pathname.endsWith('-' + child.id)}
        />
      {/each}
    </Folder>
  {/if}
{/each}
