import type { QUERY_WIDGET_BLOCK_NODE } from '../schema'

import { exhaustMap, tap, of, filter } from 'rxjs'
import { useObserveFnCall } from 'san-webkit-next/utils'
import { useDashboardCtx } from '$lib-next/features/Dashboard/ctx'
import {
  useDataWidgetParameterOverrides,
  type TDashboardDataWidget,
} from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
import { queryRunDashboardSqlQuery } from '$lib/Dashboard/flow/sqlData/api'
import { useDashboardSqlQueriesCtx } from './dashboard-queries.svelte'

export function useSqlWidgetFlow(widget: TDashboardDataWidget<typeof QUERY_WIDGET_BLOCK_NODE>) {
  const { state } = widget

  const { dashboard } = useDashboardCtx.get()
  const { getDashboardSqlQueryById, sqlQueryCachedData } = useDashboardSqlQueriesCtx()

  const sqlQuery = getDashboardSqlQueryById(widget.id)!
  const localParameters = sqlQuery.sqlQueryParameters

  const { parameterOverrides } = useDataWidgetParameterOverrides(widget.id, localParameters)

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

  return {
    sqlQuery,
    sqlQueryCachedData,

    localParameters,
    parameterOverrides,

    loadSqlData,
  }
}
