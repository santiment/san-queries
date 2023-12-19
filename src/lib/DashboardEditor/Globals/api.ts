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
