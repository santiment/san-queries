import { Fetcher } from '$lib/api'

export const mutateAddDashboardGlobalParameter = Fetcher(
  (variables: {
    dashboardId: number
    key: string
    value: { string: number | string } | { stringList: (number | string)[] }
  }) => ({
    schema: `mutation addDashboardGlobalParameter($dashboardId: Int!, $key: String!, $value: DashboardGlobalParameterValue!) {
      data: addDashboardGlobalParameter(dashboardId:$dashboardId, key:$key, value:$value) {
        id
      }
  }`,
    variables,
  }),
  (gql: { data: { id: number } }) => gql.data,
)

export const mutateDeleteDashboardGlobalParameter = Fetcher(
  (variables: { dashboardId: number; key: string }) => ({
    schema: `mutation deleteDashboardGlobalParameter($dashboardId: Int!, $key: String!) {
      deleteDashboardGlobalParameter(dashboardId:$dashboardId, key:$key) {
        id
      }
  }`,
    variables,
  }),
)

export const mutateUpdateDashboardGlobalParameter = Fetcher(
  (variables: {
    dashboardId: number
    key: string
    newKey?: string
    newValue?: { string: number | string }
  }) => ({
    schema: `mutation updateDashboardGlobalParameter($dashboardId: Int!, $key: String!, $newValue: DashboardGlobalParameterValue, $newKey: String) {
      updateDashboardGlobalParameter(dashboardId:$dashboardId, key:$key, newKey:$newKey, newValue:$newValue) {
        id
      }
  }`,
    variables,
  }),
)

export const mutateAddDashboardGlobalParameterOverride = Fetcher(
  (variables: {
    dashboardId: number
    dashboardParameterKey: string
    dashboardQueryMappingId: string
    queryParameterKey: string
  }) => ({
    schema: `mutation addDashboardGlobalParameterOverride($dashboardId: Int!,  $dashboardParameterKey:String!, $dashboardQueryMappingId:String!, $queryParameterKey:String!) {
      addDashboardGlobalParameterOverride(dashboardId:$dashboardId, dashboardParameterKey:$dashboardParameterKey, dashboardQueryMappingId:$dashboardQueryMappingId, queryParameterKey:$queryParameterKey) {
        id
        parameters
      }
  }`,
    variables,
  }),
)

export const mutateDeleteDashboardGlobalParameterOverride = Fetcher(
  (variables: {
    dashboardId: number
    dashboardParameterKey: string
    dashboardQueryMappingId: string
  }) => ({
    schema: `mutation deleteDashboardGlobalParameterOverride($dashboardId: Int!,  $dashboardParameterKey:String!, $dashboardQueryMappingId:String!) {
      deleteDashboardGlobalParameterOverride(dashboardId:$dashboardId, dashboardParameterKey:$dashboardParameterKey, dashboardQueryMappingId:$dashboardQueryMappingId) {
        id
        parameters
      }
  }`,
    variables,
  }),
)
