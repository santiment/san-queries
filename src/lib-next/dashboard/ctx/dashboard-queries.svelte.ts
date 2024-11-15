import type { TApiDashboard, TDataWidgetKey } from '$lib-next/dashboard/types'
import type { TDashboardSqlData } from '../sql-query/api/cache'

import { ss } from 'svelte-runes'
import { createCtx } from 'san-webkit-next/utils'
import { Query } from 'san-webkit-next/api/executor.js'
import { queryGetCachedQueryExecutions } from '$lib/QueryEditor/api'

export const useDashboardSqlQueriesCtx = createCtx(
  'dashboard_useDashboardSqlQueriesCtx',
  (apiDashboard?: null | TApiDashboard<any>, cache?: null | TDashboardSqlData[]) => {
    const { queries = [] } = apiDashboard || {}

    const dashboardSqlQueries = ss(queries)

    const dashboardSqlQueryById = $derived(
      new Map(dashboardSqlQueries.$.map((item) => [item.dashboardQueryMappingId, item])),
    )

    const sqlQueryCachedData = new Map<string, undefined | TDashboardSqlData>(
      (cache || []).map((item) => [item.dashboardQueryMappingId, item] as const),
    )

    return {
      dashboardSqlQueries,
      getDashboardSqlQueryById(id: null | undefined | TDataWidgetKey) {
        return dashboardSqlQueryById.get(id!)
      },
      sqlQueryCachedData,

      loadSqlQueryCache(sqlQueryId: number, dashboardMappingId?: TDataWidgetKey) {
        return queryGetCachedQueryExecutions(Query)(sqlQueryId).then((caches) => {
          const cache = caches[0]?.result as undefined | TDashboardSqlData

          if (cache && dashboardMappingId) {
            cache.dashboardQueryMappingId = dashboardMappingId
            sqlQueryCachedData.set(dashboardMappingId, cache)
          }

          return cache
        })
      },
    }
  },
)
