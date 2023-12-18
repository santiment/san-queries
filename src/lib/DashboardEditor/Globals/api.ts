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
