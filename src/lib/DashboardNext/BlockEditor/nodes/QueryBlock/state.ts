import type { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
import { Map as Map$ } from 'svelte/reactivity'

function getOutputs(sqlData?: null | App.SqlData) {
  return sqlData?.columns
}

export function createQueryWidget(
  query: App.ApiDashboard['queries'][number],
  dashboardData?: ReturnType<typeof useDahboardSqlDataCtx>['dashboardData'],
) {
  const id = query.dashboardQueryMappingId
  const widgetData = dashboardData?.get(id)

  return {
    id,
    type: 'query-widget',
    data: query,
    state: new Map$<string, any>([
      ['sqlData', widgetData?.displayedData.$],
      ['outputs', getOutputs(widgetData?.defaultData.$)],
    ]),
  }
}
