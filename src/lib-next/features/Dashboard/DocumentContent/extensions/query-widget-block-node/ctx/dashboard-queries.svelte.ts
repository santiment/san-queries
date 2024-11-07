import type { TApiDashboard, TDataWidgetKey } from '$lib-next/features/Dashboard/types'
import { createCtx } from 'san-webkit-next/utils'
import { ss } from 'svelte-runes'

export const useDashboardSqlQueriesCtx = createCtx(
  'dashboard_useDashboardSqlQueriesCtx',
  (apiDashboard?: null | TApiDashboard<any>) => {
    const { queries = [] } = apiDashboard || {}

    const dashboardSqlQueries = ss(queries)

    const dashboardSqlQueryById = $derived(
      new Map(dashboardSqlQueries.$.map((item) => [item.dashboardQueryMappingId, item])),
    )

    return {
      dashboardSqlQueries,
      getDashboardSqlQueryById(id: TDataWidgetKey) {
        return dashboardSqlQueryById.get(id)
      },
    }
  },
)
