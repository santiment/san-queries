<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './index.svelte'

  export const showAddQueryToDashboardDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import { pipe, switchMap, tap } from 'rxjs'
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import { queryGetMostRecent, type TEntities } from '$routes/explorer/api'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import { useAddQueryToDashboardFlow } from '$lib/Dashboard/flow/widgets'
  import Svg from '$lib/ui/Svg.svelte'
  import { cn } from '$lib/ui/utils'
  import Queries from './Queries.svelte'

  let { dashboardId, ...rest }: { dashboardId: number; DialogCtx: any } = $props()

  const TABS = [
    { title: 'My queries', icon: 'chart' },
    { title: 'Queries from the community', icon: 'user' },
  ] as const
  type TTab = (typeof TABS)[number]

  const { addQueryToDashboard } = useAddQueryToDashboardFlow()

  let tab = $state.frozen(TABS[0] as TTab)

  let filteredQueries = $state.frozen([] as TEntities)

  function onQueryAdd(item: any) {
    addQueryToDashboard({ dashboardId, queryId: item.id, onComplete: console.log })
  }

  function onTabSelect(item: TTab) {
    tab = item
  }

  const queryItems = useObserveFnCall<{ currentUserDataOnly: boolean }>(() =>
    pipe(
      tap(() => (filteredQueries = [])),
      switchMap(({ currentUserDataOnly }) =>
        queryGetMostRecent()({ pageSize: 150, types: ['QUERY'], currentUserDataOnly }).pipe(
          tap((data) => (filteredQueries = data.items)),
        ),
      ),
    ),
  )

  $effect(() => {
    queryItems({ currentUserDataOnly: tab === TABS[0] })
  })
</script>

<Dialog
  {...rest}
  title="Add queries to this dashboard"
  class="h-full !max-h-[560px] w-full !max-w-[960px]"
>
  <div class="dialog-body">
    <tabs class="mb-4 flex gap-4 border-b">
      {#each TABS as item (item.title)}
        <button
          class={cn(
            'row items-center gap-2 border-b border-transparent pb-1.5',
            tab === item && 'border-green fill-green text-green',
          )}
          onclick={() => onTabSelect(item)}
        >
          <Svg id={item.icon} w="12" />
          {item.title}
        </button>
      {/each}
    </tabs>

    <!-- <Search class="mrg-xl mrg--t mrg--b" big placeholder="Search for a query" on:input={onInput} /> -->

    <Queries {tab} queries={filteredQueries} {onQueryAdd} />
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
