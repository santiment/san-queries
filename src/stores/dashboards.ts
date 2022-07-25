import type { ShortDashboard } from '@/api/dashboard'
import { queryUserDashboards, RECENT_USER_DASHBOARDS_QUERY } from '@/api/dashboard'
import { QueryStore } from './utils'

export const myDashboards$ = QueryStore<ShortDashboard[]>(
  [],
  queryUserDashboards,
  RECENT_USER_DASHBOARDS_QUERY,
)
