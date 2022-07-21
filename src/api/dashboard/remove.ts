import { mutate } from 'webkit/api'

const REMOVE_DASHBOARD_PANEL_MUTATION = (dashboardId: number, panelId: string) => `
  mutation {
    removeDashboardPanel(dashboardId:${dashboardId}, panelId:"${panelId}") {
      id
    }
  }`

export const mutateRemoveDashboardPanel = (dashboardId: number, panelId: string) =>
  mutate<any>(REMOVE_DASHBOARD_PANEL_MUTATION(dashboardId, panelId))
