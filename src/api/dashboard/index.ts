import { query } from 'webkit/api'
import { Cache } from 'webkit/api/cache'
import { DASHBOARD_FRAGMENT } from './fragments'

const DASHBOARD_QUERY = (id: number) => `{
  dashboard:getDashboardSchema(id:${id}){
    ${DASHBOARD_FRAGMENT}
  }
}`

const dashboardAccessor = ({ dashboard }) => dashboard
export const queryDashboard = (id: number) =>
  query<any>(DASHBOARD_QUERY(id)).then(dashboardAccessor) as Promise<SAN.Queries.Dashboard>

export const setQueryDashboardCache = (id: number, dashboard: any) =>
  Cache.set(DASHBOARD_QUERY(id), { dashboard })

export const deleteQueryDashboardCache = (id: number) => Cache.delete(DASHBOARD_QUERY(id))

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
}`

export type ShortDashboard = {
  id: number
  title: string
  description?: string
  updatedAt: string
}

type RecentDashboardsQuery = SAN.API.Query<
  'currentUser',
  null | {
    dashboards: ShortDashboard[]
  }
>

const sorter = (a: ShortDashboard, b: ShortDashboard) =>
  Date.parse(b.updatedAt) - Date.parse(a.updatedAt)

function precacheCurrentUserDashboards(data: RecentDashboardsQuery) {
  if (data.currentUser) {
    data.currentUser.dashboards.sort(sorter)
  }

  return data
}

const precacher = () => precacheCurrentUserDashboards

const userDashboardsAccessor = ({ currentUser }: RecentDashboardsQuery) =>
  (currentUser?.dashboards || []) as ShortDashboard[]
export const queryUserDashboards = () =>
  query<RecentDashboardsQuery>(RECENT_USER_DASHBOARDS_QUERY, {
    precacher,
  }).then(userDashboardsAccessor)
