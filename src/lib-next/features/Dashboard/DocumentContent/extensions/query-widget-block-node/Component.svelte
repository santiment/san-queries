<script lang="ts">
  import type { QUERY_WIDGET_BLOCK_NODE } from './schema'
  import type { TDataWidgetProps } from '../schema/data-widget'

  import { exhaustMap, tap, of, filter } from 'rxjs'
  import { useObserveFnCall } from 'san-webkit-next/utils'
  import { queryRunDashboardSqlQuery } from '$lib/Dashboard/flow/sqlData/api'
  import { useDataWidgetParameterOverrides } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte.js'
  import { useDashboardCtx } from '$lib-next/features/Dashboard/ctx'
  import { useDashboardSqlQueriesCtx } from './ctx/dashboard-queries.svelte'
  import Visualisation from './Visualisation.svelte'
  import Header from './Header.svelte'
  import Parameters from './Parameters.svelte'

  let { data }: TDataWidgetProps<typeof QUERY_WIDGET_BLOCK_NODE> = $props()

  const { id, widget } = data
  const state = widget.state

  const { dashboard } = useDashboardCtx.get()
  const { getDashboardSqlQueryById, sqlQueryCachedData } = useDashboardSqlQueriesCtx()

  const sqlQuery = getDashboardSqlQueryById(id)!
  const localParameters = sqlQuery.sqlQueryParameters

  const { parameterOverrides } = useDataWidgetParameterOverrides(id, localParameters)
  const sqlData = $derived(state.$$.sqlData || sqlQueryCachedData.get(id))

  Object.assign(state.$$.lastFetchedParameterValues, localParameters, parameterOverrides.$)

  const loadSqlData = useObserveFnCall<{ isForced: boolean }>(() =>
    exhaustMap(({ isForced = false }) =>
      of(JSON.stringify(state.$$.lastFetchedParameterValues)).pipe(
        filter(
          (lastHash) =>
            isForced ||
            lastHash !== JSON.stringify({ ...localParameters, ...parameterOverrides.$ }),
        ),
        tap(() => (state.$$.isLoading = true)),
        exhaustMap(() => {
          const overrides = { ...parameterOverrides.$ }

          return queryRunDashboardSqlQuery()(
            dashboard.apiDashboard!.id,
            widget.id,
            JSON.stringify(overrides),
          ).pipe(tap((sqlData) => onSqlUpdate(sqlData, overrides)))
        }),
      ),
    ),
  )
  Object.assign(state.$$, { loadSqlData: (isForced = false) => loadSqlData({ isForced }) })

  function onSqlUpdate(sqlData: null | App.SqlData, overrides: Record<string, any>) {
    state.$$.sqlData = sqlData
    state.$$.lastFetchedParameterValues = Object.assign({}, localParameters, overrides)
    state.$$.isLoading = false
  }
</script>

<section class="flex min-h-0 flex-1 flex-col rounded border bg-white">
  <Header
    id={sqlQuery.id}
    name={sqlQuery.name}
    author={sqlQuery.user}
    {widget}
    onRefreshClick={() => loadSqlData({ isForced: true })}
  ></Header>

  {#if dashboard.isEditable}
    {#key localParameters}
      <Parameters
        {localParameters}
        {parameterOverrides}
        lastFetchedParameterValues={state.$$.lastFetchedParameterValues}
      ></Parameters>
    {/key}
  {/if}

  <div class="relative flex min-h-0 flex-1 flex-col items-center justify-center border-t">
    {#if state.$$.isLoading}
      <div
        class="absolute left-0 top-0 z-[2] flex h-full w-full items-center justify-center bg-white/70"
      >
        <div class="flex rounded bg-athens px-9 py-7">
          <loading-spin style="--loading-size:48px;border-width:6px"></loading-spin>
        </div>
      </div>
    {/if}

    {#if sqlData}
      {#key sqlData}
        <Visualisation {sqlQuery} {sqlData}></Visualisation>
      {/key}
    {:else if !!state.$$.isLoading}
      <div class="rounded bg-athens px-5 py-3 text-center">
        <h3 class="text-xl font-bold">No data</h3>
        <p>Execute query first</p>
      </div>
    {/if}
  </div>
</section>
