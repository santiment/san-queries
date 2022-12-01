import { mutate } from 'san-webkit/lib/api';
const COMPUTE_AND_STORE_MUTATION = (dashboardId, panelId) => `
  mutation {
    computeAndStoreDashboardPanel(dashboardId:${dashboardId}, panelId:"${panelId}") {
      id
    }
  }`;
export const mutateComputeAndStorePanel = (dashboardId, panelId) => mutate(COMPUTE_AND_STORE_MUTATION(dashboardId, panelId));
//# sourceMappingURL=store.js.map