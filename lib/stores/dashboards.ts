import type { ShortDashboard } from './../../lib/api/dashboard'
import { QueryStore } from 'san-webkit/lib/stores/utils'
import { queryUserDashboards, RECENT_USER_DASHBOARDS_QUERY } from './../../lib/api/dashboard'

export const myDashboards$ = QueryStore<ShortDashboard[]>(
  [],
  queryUserDashboards,
  RECENT_USER_DASHBOARDS_QUERY,
)
