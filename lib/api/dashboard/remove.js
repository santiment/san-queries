import { mutate } from 'san-webkit/lib/api';
const REMOVE_DASHBOARD_PANEL_MUTATION = (dashboardId, panelId) => `
  mutation {
    removeDashboardPanel(dashboardId:${dashboardId}, panelId:"${panelId}") {
      id
    }
  }`;
export const mutateRemoveDashboardPanel = (dashboardId, panelId) => mutate(REMOVE_DASHBOARD_PANEL_MUTATION(dashboardId, panelId));
//# sourceMappingURL=remove.js.map