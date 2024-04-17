import { QUERY_FRAGMENT } from '$lib/QueryEditor/api'
import { Fetcher } from '$lib/api'

export const mutateCreateDashboardQuery = Fetcher(
  (variables: { dashboardId: number; queryId: number }) => ({
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

export const mutateDeleteDashboardQuery = Fetcher(
  (variables: { dashboardId: number; dashboardQueryMappingId: string }) => ({
    schema: `mutation($dashboardId:Int!, $dashboardQueryMappingId:String!) {
    deleted:deleteDashboardQuery(dashboardId:$dashboardId, dashboardQueryMappingId:$dashboardQueryMappingId) {
      id
    }
  }`,
    variables,
  }),
)

// ----
export const mutateAddDashboardTextWidget = Fetcher(
  (variables: { dashboardId: number; body?: string }) => ({
    schema: `mutation($dashboardId: Int!, $body: String) {
    data:addDashboardTextWidget(dashboardId:$dashboardId, body:$body) {
      textWidget {id body}
    }
  }`,
    variables,
  }),
  (gql: { data: { textWidget: App.ApiTextWidget } }) => gql.data.textWidget,
)

export const mutateUpdateDashboardTextWidget = Fetcher(
  (variables: { textWidgetId: string; dashboardId: number; value: string }) => ({
    schema: `mutation($textWidgetId: String!, $dashboardId: Int!, $value: String) {
    updateDashboardTextWidget(textWidgetId:$textWidgetId, dashboardId:$dashboardId, body:$value) {
      textWidget {id body}
    }
  }`,
    variables,
  }),
)

export const mutateDeleteDashboardTextWidget = Fetcher(
  (variables: { dashboardId: number; textWidgetId: string }) => ({
    schema: `mutation($dashboardId:Int!, $textWidgetId:String!) {
    deleted:deleteDashboardTextWidget(dashboardId:$dashboardId, textWidgetId:$textWidgetId) {
      textWidget {id}
    }
  }`,
    variables,
  }),
)
