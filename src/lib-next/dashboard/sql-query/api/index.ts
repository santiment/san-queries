import type { TDashboardKey, TDataWidgetKey } from '$lib-next/dashboard/types'

import { ApiMutation } from 'san-webkit-next/api'
import { QUERY_FRAGMENT } from '$lib/QueryEditor/api'

export const mutateCreateDashboardQuery = ApiMutation(
  (variables: { dashboardId: TDashboardKey; queryId: number }) => ({
    schema: `mutation ($dashboardId: Int!, $queryId: Int!) {
    created:createDashboardQuery(dashboardId:$dashboardId, queryId:$queryId) {
      id
      query { ${QUERY_FRAGMENT} }
    }
  }`,
    variables,
  }),
  ({ created: { id, query } }: { created: { id: string; query: App.ApiQueryWidget } }) => {
    query.dashboardQueryMappingId = id
    if (!query.user) query.user = { id: 0, username: '' }
    return query
  },
)

export const mutateDeleteDashboardQuery = ApiMutation(
  (variables: { dashboardId: TDashboardKey; dashboardQueryMappingId: TDataWidgetKey }) => ({
    schema: `mutation($dashboardId:Int!, $dashboardQueryMappingId:String!) {
    deleted:deleteDashboardQuery(dashboardId:$dashboardId, dashboardQueryMappingId:$dashboardQueryMappingId) {
      id
    }
  }`,
    variables,
  }),
)
