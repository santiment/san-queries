import { mutate } from 'webkit/api'

export const mutateAddDashboardGlobalParameter = (variables: any) =>
  mutate(
    `mutation addDashboardGlobalParameter($dashboardId: Int!, $key: String!, $value: DashboardGlobalParameterValue!) {
      addDashboardGlobalParameter(dashboardId:$dashboardId, key:$key, value:$value) {
        id
      }
  }`,
    { variables },
  )

export const mutateDeleteDashboardGlobalParameter = (variables: any) =>
  mutate(
    `mutation deleteDashboardGlobalParameter($dashboardId: Int!, $key: String!) {
      deleteDashboardGlobalParameter(dashboardId:$dashboardId, key:$key) {
        id
      }
  }`,
    { variables },
  )

export const mutateUpdateDashboardGlobalParameter = (variables: any) =>
  mutate(
    `mutation updateDashboardGlobalParameter($dashboardId: Int!, $key: String!, $newValue: DashboardGlobalParameterValue!, $newKey: String!) {
      updateDashboardGlobalParameter(dashboardId:$dashboardId, key:$key, newKey:$newKey, newValue:$newValue) {
        id
      }
  }`,
    { variables },
  )

export const mutateAddDashboardGlobalParameterOverride = (variables: any) =>
  mutate(
    `mutation addDashboardGlobalParameterOverride($dashboardId: Int!,  $dashboardParameterKey:String!, $dashboardQueryMappingId:String!, $queryParameterKey:String!) {
      addDashboardGlobalParameterOverride(dashboardId:$dashboardId, dashboardParameterKey:$dashboardParameterKey, dashboardQueryMappingId:$dashboardQueryMappingId, queryParameterKey:$queryParameterKey) {
        id
        parameters
      }
  }`,
    { variables },
  )

export const mutateDeleteDashboardGlobalParameterOverride = (variables: any) =>
  mutate(
    `mutation deleteDashboardGlobalParameterOverride($dashboardId: Int!,  $dashboardParameterKey:String!, $dashboardQueryMappingId:String!) {
      deleteDashboardGlobalParameterOverride(dashboardId:$dashboardId, dashboardParameterKey:$dashboardParameterKey, dashboardQueryMappingId:$dashboardQueryMappingId) {
        id
        parameters
      }
  }`,
    { variables },
  )
