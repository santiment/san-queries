import { mutate } from 'san-webkit/lib/api';
import { PANEL_FRAGMENT, SHORT_DASHBOARD_FRAGMENT } from './fragments';
const CREATE_DASHBOARD_MUTATION = `
  mutation($title:String!, $description:String, $isPublic:Boolean) {
    createDashboard(name:$title, description:$description, isPublic:$isPublic) {
      ${SHORT_DASHBOARD_FRAGMENT}
    }
  }`;
const createDashboardAccessor = ({ createDashboard }) => createDashboard;
export const mutateCreateDashboard = (variables) => mutate(CREATE_DASHBOARD_MUTATION, {
    variables,
}).then(createDashboardAccessor);
// ---------------------------------------
const CREATE_DASHBOARD_PANEL_MUTATION = `
  mutation($dashboardId:Int!, $sql:PanelSqlInputObject!, $name:String!, $description:String, $settings:json) {
    createDashboardPanel(dashboardId:$dashboardId, panel:{sql:$sql, name:$name, description:$description, settings:$settings}) {
      ${PANEL_FRAGMENT}
    }
  }`;
const createDashboardPanelAccessor = ({ createDashboardPanel }) => createDashboardPanel;
export const mutateCreateDashboardPanel = (variables) => mutate(CREATE_DASHBOARD_PANEL_MUTATION, {
    variables,
}).then(createDashboardPanelAccessor);
// ---------------------------------------
//# sourceMappingURL=create.js.map