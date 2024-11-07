import type { TApiDashboard, TDataWidgetKey } from '$lib-next/features/Dashboard/types'
import type { TDashboardSqlData } from '$lib/Dashboard/flow/sqlData/api'
import { createCtx } from 'san-webkit-next/utils'
import { ss } from 'svelte-runes'

export const useDashboardSqlQueriesCtx = createCtx(
  'dashboard_useDashboardSqlQueriesCtx',
  (apiDashboard?: null | TApiDashboard<any>, cache?: null | TDashboardSqlData[]) => {
    const { queries = [] } = apiDashboard || {}

    const dashboardSqlQueries = ss(queries)

    const dashboardSqlQueryById = $derived(
      new Map(dashboardSqlQueries.$.map((item) => [item.dashboardQueryMappingId, item])),
    )

    const sqlQueryCachedData = new Map<string, undefined | App.SqlData>(
      (cache || []).map((item) => [item.dashboardQueryMappingId, item] as const),
    )

    return {
      dashboardSqlQueries,
      getDashboardSqlQueryById(id: TDataWidgetKey) {
        return dashboardSqlQueryById.get(id)
      },
      sqlQueryCachedData,
    }
  },
)
