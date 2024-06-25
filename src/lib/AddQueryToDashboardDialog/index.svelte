<script context="module" lang="ts">
  import Component from './index.svelte'

  export const showAddQueryToDashboardDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import { pipe, switchMap, tap } from 'rxjs'
  import { queryGetMostRecent, type TEntities } from '$routes/explorer/api'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import { useAddQueryToDashboardFlow } from '$lib/Dashboard/flow/widgets'
  import Svg from '$lib/ui/Svg.svelte'
  import { cn } from '$lib/ui/utils'
  import Queries from './Queries.svelte'
  import Dialog, { dialogs$ } from 'san-webkit-next/ui/core/Dialog'
  import Input from 'san-webkit-next/ui/core/Input'
  import { ssd } from 'svelte-runes'

  let { dashboardId, onComplete, ...rest }: { dashboardId: number; DialogCtx: any } = $props()

  const TABS = [
    { title: 'My queries', icon: 'chart' },
    { title: 'Queries from the community', icon: 'user' },
  ] as const
  type TTab = (typeof TABS)[number]

  const { addQueryToDashboard } = useAddQueryToDashboardFlow()

  let tab = $state.frozen(TABS[0] as TTab)

  let filteredQueries = $state.frozen([] as TEntities)
  let searchedQueries = ssd(() => filteredQueries)

  function onQueryAdd(item: any) {
    addQueryToDashboard({ dashboardId, queryId: item.id, onComplete })
  }

  function onTabSelect(item: TTab) {
    tab = item
  }

  const queryItems = useObserveFnCall<{ currentUserDataOnly: boolean }>(() =>
    pipe(
      tap(() => (filteredQueries = [])),
      switchMap(({ currentUserDataOnly }) =>
        queryGetMostRecent()({ pageSize: 800, types: ['QUERY'], currentUserDataOnly }).pipe(
          tap((data) => (filteredQueries = data.items)),
        ),
      ),
    ),
  )

  function onSearchInput(e: Event) {
    const searchTerm = e.currentTarget.value.trim().toLowerCase()

    searchedQueries.$ = filteredQueries.filter((query) => {
      return query?.name.toLowerCase().includes(searchTerm)
    })
  }

  $effect(() => {
    queryItems({ currentUserDataOnly: tab === TABS[0] })
  })
</script>

<Dialog class="h-full !max-h-[560px] w-full !max-w-[960px] column">
  <h2 class="border-b px-5 py-3 text-base">Add queries to this dashboard</h2>
  <div class="dialog-body flex-1 overflow-auto column">
    <tabs class="mb-4 flex gap-4 border-b">
      {#each TABS as item (item.title)}
        <button
          class={cn(
            'items-center gap-2 border-b border-transparent pb-1.5 row',
            tab === item && 'border-green fill-green text-green',
          )}
          onclick={() => onTabSelect(item)}
        >
          <Svg id={item.icon} w="12" />
          {item.title}
        </button>
      {/each}
    </tabs>

    <Input
      icon="search"
      iconSize="12"
      placeholder="Search for a query"
      class="mb-4"
      autofocus
      oninput={onSearchInput}
    ></Input>

    <!-- <Search class="mrg-xl mrg--t mrg--b" big placeholder="Search for a query" on:input={onInput} /> -->

    <Queries {tab} queries={searchedQueries.$} {onQueryAdd} />
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 960px;
  }

  .dialog-body {
    padding: 24px 32px;
  }

  Tabs {
    --tab-padding: 6px 8px;
  }
</style>
