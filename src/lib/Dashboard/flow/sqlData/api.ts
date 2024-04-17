import { Fetcher } from '$lib/api'

export type TDashboardSqlData = App.SqlData & {
  clickhouseQueryId: string
  dashboardQueryMappingId: string
}

export const queryGetCachedDashboardQueriesExecutions = Fetcher(
  (dashboardId: number) =>
    `{
    data:getCachedDashboardQueriesExecutions(dashboardId:${dashboardId}) {
      queries{
        rows
        columns
        columnTypes

        queryStartTime
        queryEndTime
        summary

        queryId
        clickhouseQueryId
        dashboardQueryMappingId
      }
    }
  }`,
  (gql: {
    data: {
      queries: TDashboardSqlData[]
    }
  }) => gql.data.queries,
)

export const mutateStoreDashboardQueryExecution = Fetcher(
  (variables: {
    compressedData: string
    dashboardId: number
    dashboardQueryMappingId: string
  }) => ({
    schema: `mutation ($compressedData: String!, $dashboardId: Int!, $dashboardQueryMappingId: String!) {
    dashboard:storeDashboardQueryExecution(compressedQueryExecutionResult: $compressedData, dashboardId:$dashboardId, dashboardQueryMappingId:$dashboardQueryMappingId) {
      queries {queryId}
    }
  }`,
    variables,
  }),
)

export const queryRunDashboardSqlQuery = Fetcher(
  (dashboardId: number, dashboardQueryMappingId: string) =>
    `{
    data:runDashboardSqlQuery(dashboardId:${dashboardId}, dashboardQueryMappingId:"${dashboardQueryMappingId}") {
        rows
        columns
        columnTypes

        queryStartTime
        queryEndTime
        summary

        queryId
        clickhouseQueryId
        dashboardQueryMappingId
    }
  }`,
  (gql: { data: TDashboardSqlData }) => gql.data,
)
