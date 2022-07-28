import type { ShortDashboard } from '@/api/dashboard'
import { QueryStore } from 'webkit/stores/utils'
import { queryUserDashboards, RECENT_USER_DASHBOARDS_QUERY } from '@/api/dashboard'

export const myDashboards$ = QueryStore<ShortDashboard[]>(
  [],
  queryUserDashboards,
  RECENT_USER_DASHBOARDS_QUERY,
)
