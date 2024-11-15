import type { TDashboardKey, TDataWidgetKey } from '$lib-next/dashboard/types'
import { ApiQuery } from 'san-webkit-next/api'

export type TDashboardSqlData = App.SqlData & {
  clickhouseQueryId: string
  dashboardQueryMappingId: string
}

export const queryGetCachedDashboardQueriesExecutions = ApiQuery(
  (dashboardId: TDashboardKey) =>
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

export const mutateStoreDashboardQueryExecution = ApiQuery(
  (variables: {
    compressedData: string
    dashboardId: TDashboardKey
    dashboardQueryMappingId: TDataWidgetKey
  }) => ({
    schema: `mutation ($compressedData: String!, $dashboardId: Int!, $dashboardQueryMappingId: String!) {
    dashboard:storeDashboardQueryExecution(compressedQueryExecutionResult: $compressedData, dashboardId:$dashboardId, dashboardQueryMappingId:$dashboardQueryMappingId) {
      queries {queryId}
    }
  }`,
    variables,
  }),
)

export const queryRunDashboardSqlQuery = ApiQuery(
  (
    dashboardId: TDashboardKey,
    dashboardQueryMappingId: TDataWidgetKey,
    parameterOverrides?: string,
  ) => ({
    schema: `query($parameterOverrides:json){
    data:runDashboardSqlQuery(dashboardId:${dashboardId}, dashboardQueryMappingId:"${dashboardQueryMappingId}", parametersOverride:$parameterOverrides) {
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
    variables: { parameterOverrides },
  }),
  (gql: { data: TDashboardSqlData }) => gql.data,
)
