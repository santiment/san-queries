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
  currentUser {
    dashboards {
      id
      title:name
      description
      updatedAt
    }
  }
}`;
const sorter = (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
function precacheCurrentUserDashboards(data) {
    if (data.currentUser) {
        data.currentUser.dashboards.sort(sorter);
    }
    return data;
}
const precacher = () => precacheCurrentUserDashboards;
const userDashboardsAccessor = ({ currentUser }) => ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.dashboards) || []);
export const queryUserDashboards = () => query(RECENT_USER_DASHBOARDS_QUERY, {
    precacher,
}).then(userDashboardsAccessor);
//# sourceMappingURL=index.js.map