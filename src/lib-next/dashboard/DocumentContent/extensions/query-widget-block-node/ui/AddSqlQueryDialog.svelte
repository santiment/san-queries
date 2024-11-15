<script module lang="ts">
  import type { ComponentProps } from 'svelte'
  import Component from './AddSqlQueryDialog.svelte'

  export const showAddSqlQueryDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import Dialog, { dialogs$, type TDialogProps } from 'san-webkit-next/ui/core/Dialog'

  import Input from 'san-webkit-next/ui/core/Input'
  import Button from 'san-webkit-next/ui/core/Button'
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { cn } from 'san-webkit-next/ui/utils'
  import VirtualList from 'san-webkit-next/ui/app/VirtualList'
  import { queryGetMostRecent, type TEntities, type TEntityMap } from '$routes/explorer/api'
  import User from '$lib/ui/User/index.svelte'
  import { mutateCreateDashboardQuery } from '$lib-next/dashboard/sql-query/api'
  import { useDashboardCtx } from '$lib-next/dashboard/ctx'
  import { useObserveFnCall } from 'san-webkit-next/utils'
  import { exhaustMap, pipe, switchMap, take, tap } from 'rxjs'
  import type {
    TApiDashboardSqlQuery,
    TDashboardKey,
    TDataWidgetKey,
  } from '$lib-next/dashboard/types'
  import { useDashboardSqlQueriesCtx } from '$lib-next/dashboard/ctx/dashboard-queries.svelte'
  import { createStoreDashboardSqlCache$ } from '$lib-next/dashboard/sql-query/flow/cache'

  type TProps = TDialogProps<TApiDashboardSqlQuery> & {
    onComplete: (dashboardQueryMappingId: TDataWidgetKey, sqlQueryId: number) => void
  }

  let { Controller, onComplete }: TProps = $props()

  const TABS = [
    { title: 'My queries', icon: 'chart' },
    { title: 'Queries from the community', icon: 'user' },
  ]

  const { dashboard } = useDashboardCtx.get()
  const { dashboardSqlQueries, loadSqlQueryCache } = useDashboardSqlQueriesCtx.get()

  let searchTerm = $state.raw('')
  let selectedTab = $state.raw(TABS[0])
  let loading = $state(false)

  let filteredQueries = $state.raw([] as TEntities)
  let searchedQueries = $derived(
    filteredQueries.filter((item) =>
      item?.name.toLowerCase().includes(searchTerm),
    ) as TEntityMap['query'][],
  )

  const createDashboardQuery = useObserveFnCall<{ dashboardId: TDashboardKey; queryId: number }>(
    () =>
      exhaustMap((variables) =>
        mutateCreateDashboardQuery()(variables).pipe(tap(onSqlQueryCreated)),
      ),
  )

  const loadSqlQueries = useObserveFnCall<{ currentUserDataOnly: boolean }>(() =>
    pipe(
      tap(() => (filteredQueries = [])),
      switchMap(({ currentUserDataOnly }) =>
        queryGetMostRecent()({ pageSize: 800, types: ['QUERY'], currentUserDataOnly }).pipe(
          tap((data) => (filteredQueries = data.items)),
        ),
      ),
    ),
  )

  $effect(() => {
    loadSqlQueries({ currentUserDataOnly: selectedTab === TABS[0] })
  })

  function onSearchInput(e: Event & { currentTarget: HTMLInputElement }) {
    searchTerm = e.currentTarget.value.trim().toLowerCase()
  }

  function onAddClick(query: TEntityMap['query']) {
    const { apiDashboard } = dashboard
    if (!apiDashboard) return

    loading = true

    createDashboardQuery({ dashboardId: apiDashboard.id, queryId: +query.id })
  }

  function onSqlQueryCreated(apiSqlQuery: TApiDashboardSqlQuery) {
    dashboardSqlQueries.$.push(apiSqlQuery)
    dashboardSqlQueries.$ = dashboardSqlQueries.$.slice()

    // createDashboardDataWidget(apiSqlQuery, QUERY_WIDGET_BLOCK_NODE)
    loadSqlQueryCache(apiSqlQuery.id, apiSqlQuery.dashboardQueryMappingId).then((cache) => {
      onComplete(apiSqlQuery.dashboardQueryMappingId, apiSqlQuery.id)

      if (cache) {
        createStoreDashboardSqlCache$(dashboard.apiDashboard!.id, cache).pipe(take(1)).subscribe()
      }

      Controller.resolve(apiSqlQuery)
      Controller.close()
    })
  }
</script>

<Dialog class="h-full !max-h-[560px] w-full !max-w-[960px] column">
  <h2 class="border-b px-5 py-3 text-base">Add queries to this dashboard</h2>

  <div class="flex-1 overflow-auto px-8 py-6 column">
    <div class="tabs mb-4 flex gap-4 border-b">
      {#each TABS as item}
        <Button
          icon={item.icon}
          iconSize="12"
          class={cn(
            'items-center border-b border-transparent pb-1.5',
            selectedTab === item && 'border-green fill-green text-green',
          )}
          onclick={() => (selectedTab = item)}
        >
          {item.title}
        </Button>
      {/each}
    </div>

    <Input
      icon="search"
      iconSize="12"
      placeholder="Search for a query"
      class="mb-4"
      autofocus
      oninput={onSearchInput}
    ></Input>

    <section class="flex flex-1 flex-col gap-2">
      <VirtualList data={searchedQueries} getKey={(v) => v.id}>
        {#snippet children(item)}
          <article class="flex h-12 items-center gap-2 rounded-lg px-3 py-2 hover:bg-athens">
            <User
              class="text-fiord"
              user={item.user}
              source="queries_add_query_to_dashboard"
              feature="query"
            />

            <div class="h-6 w-[1px] bg-mystic"></div>

            <div class="flex min-w-0 items-center gap-2">
              <Svg id="table" w="12" />
              <span class="single-line">{item.name || 'Untitled query'}</span>
            </div>

            <Button
              variant="border"
              disabled={loading}
              class={'ml-auto min-h-8 min-w-[67px] justify-center fill-green'}
              onclick={() => onAddClick(item)}
            >
              Add
            </Button>
          </article>
        {/snippet}
      </VirtualList>
    </section>
  </div>
</Dialog>
