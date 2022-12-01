import { mutate } from 'san-webkit/lib/api';
import { PANEL_FRAGMENT, SHORT_DASHBOARD_FRAGMENT } from './fragments';
const UPDATE_DASHBOARD_MUTATION = `
  mutation($id:Int!, $title:String!, $description:String, $isPublic:Boolean) {
    updateDashboard(id:$id, name:$title, description:$description, isPublic:$isPublic) {
      ${SHORT_DASHBOARD_FRAGMENT}
    }
  }`;
const updateDashboardAccessor = ({ updateDashboard }) => updateDashboard;
export const mutateUpdateDashboard = (variables) => mutate(UPDATE_DASHBOARD_MUTATION, {
    variables,
}).then(updateDashboardAccessor);
// ---------------------------------------
const UPDATE_DASHBOARD_PANEL_MUTATION = `
  mutation($dashboardId:Int!, $panelId:String!, $sql:PanelSqlInputObject!, $name:String!, $description:String, $settings:json) {
    updateDashboardPanel(dashboardId:$dashboardId, panelId:$panelId, panel:{sql:$sql, name:$name, description:$description, settings:$settings}) {
      ${PANEL_FRAGMENT}
    }
  }`;
const updateDashboardPanelAccessor = ({ updateDashboardPanel }) => updateDashboardPanel;
export const mutateUpdateDashboardPanel = (variables) => mutate(UPDATE_DASHBOARD_PANEL_MUTATION, {
    variables,
}).then(updateDashboardPanelAccessor);
// ---------------------------------------
//# sourceMappingURL=update.js.map