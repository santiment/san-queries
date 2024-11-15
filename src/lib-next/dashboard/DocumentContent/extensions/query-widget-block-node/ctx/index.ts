import type { QUERY_WIDGET_BLOCK_NODE } from '../schema'

import { exhaustMap, tap, of, filter, switchMap } from 'rxjs'
import { onMount } from 'svelte'
import { useObserveFnCall } from 'san-webkit-next/utils'
import { useDashboardCtx } from '$lib-next/dashboard/ctx'
import {
  useDataWidgetParameterOverrides,
  type TDashboardDataWidget,
} from '$lib-next/dashboard/ctx/data-widgets.svelte'
import { useDashboardSqlQueriesCtx } from '$lib-next/dashboard/ctx/dashboard-queries.svelte'
import {
  queryRunDashboardSqlQuery,
  type TDashboardSqlData,
} from '$lib-next/dashboard/sql-query/api/cache'
import { createStoreDashboardSqlCache$ } from '$lib-next/dashboard/sql-query/flow/cache'

export function useSqlWidgetFlow(widget: TDashboardDataWidget<typeof QUERY_WIDGET_BLOCK_NODE>) {
  const { state } = widget

  const { dashboard } = useDashboardCtx.get()
  const { getDashboardSqlQueryById, sqlQueryCachedData } = useDashboardSqlQueriesCtx()

  const sqlQuery = getDashboardSqlQueryById(widget.id)!
  const localParameters = sqlQuery.sqlQueryParameters

  const { parameterOverrides } = useDataWidgetParameterOverrides(widget.id, localParameters)

  onMount(() => {
    // HACK: Might not work. If params will show `Changed` on mount, then direct assignment required instead of Object.assign
    Object.assign(state.$$.lastFetchedParameterValues, localParameters, parameterOverrides.$)
  })

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
        switchMap((sqlData) => {
          const { isEditable, apiDashboard } = dashboard
          return isEditable ? createStoreDashboardSqlCache$(apiDashboard!.id, sqlData) : of(null)
        }),
      ),
    ),
  )
  Object.assign(state.$$, { loadSqlData: (isForced = false) => loadSqlData({ isForced }) })

  function onSqlUpdate(sqlData: null | TDashboardSqlData, overrides: Record<string, any>) {
    if (sqlData && !sqlData.dashboardQueryMappingId) {
      sqlData.dashboardQueryMappingId = widget.id
    }
    state.$$.sqlData = sqlData
    state.$$.lastFetchedParameterValues = Object.assign({}, localParameters, overrides)
    state.$$.isLoading = false
  }

  return {
    sqlQuery,
    sqlQueryCachedData,

    localParameters,
    parameterOverrides,

    loadSqlData,
  }
}
