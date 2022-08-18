import { query } from 'san-webkit/lib/api';
import { Cache } from 'san-webkit/lib/api/cache';
import { DASHBOARD_FRAGMENT } from './fragments';
const DASHBOARD_QUERY = (id) => `{
  dashboard:getDashboardSchema(id:${id}){
    ${DASHBOARD_FRAGMENT}
  }
}`;
const dashboardAccessor = ({ dashboard }) => dashboard;
export const queryDashboard = (id) => query(DASHBOARD_QUERY(id)).then(dashboardAccessor);
export const setQueryDashboardCache = (id, dashboard) => Cache.set(DASHBOARD_QUERY(id), { dashboard });
export const deleteQueryDashboardCache = (id) => Cache.delete(DASHBOARD_QUERY(id));
// -------------------------
export const RECENT_USER_DASHBOARDS_QUERY = `{
  getMostRecent(types: [DASHBOARD], page: 1, pageSize: 30, currentUserDataOnly: true) {
    data {
      dashboard {
        id
        title:name
        description
      }
    }
  }
}`;
const itemAccessor = ({ dashboard }) => dashboard;
const userDashboardsAccessor = ({ getMostRecent }) => getMostRecent.data.map(itemAccessor);
export const queryUserDashboards = () => query(RECENT_USER_DASHBOARDS_QUERY).then(userDashboardsAccessor);
//# sourceMappingURL=index.js.map