import { QueryStore } from 'san-webkit/lib/stores/utils';
import { queryUserDashboards, RECENT_USER_DASHBOARDS_QUERY } from './../../lib/api/dashboard';
export const myDashboards$ = QueryStore([], queryUserDashboards, RECENT_USER_DASHBOARDS_QUERY);
//# sourceMappingURL=dashboards.js.map