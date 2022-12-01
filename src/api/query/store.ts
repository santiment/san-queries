import { mutate } from 'webkit/api'

const COMPUTE_AND_STORE_MUTATION = (dashboardId: number, panelId: string) => `
  mutation {
    computeAndStoreDashboardPanel(dashboardId:${dashboardId}, panelId:"${panelId}") {
      id
    }
  }`

export const mutateComputeAndStorePanel = (dashboardId: number, panelId: string) =>
  mutate<any>(COMPUTE_AND_STORE_MUTATION(dashboardId, panelId))
