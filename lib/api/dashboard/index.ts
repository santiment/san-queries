import { query } from 'san-webkit/lib/api'
import { Cache } from 'san-webkit/lib/api/cache'
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
  getMostRecent(types: [DASHBOARD], page: 1, pageSize: 30, currentUserDataOnly: true) {
    data {
      dashboard {
        id
        title:name
        description
      }
    }
  }
}`

export type ShortDashboard = {
  id: number
  title: string
  description
}

type RecentDashboardsQuery = SAN.API.Query<
  'getMostRecent',
  {
    data: {
      dashboard: ShortDashboard
    }[]
  }
>

const itemAccessor = ({ dashboard }) => dashboard
const userDashboardsAccessor = ({ getMostRecent }: RecentDashboardsQuery) =>
  getMostRecent.data.map(itemAccessor) as ShortDashboard[]
export const queryUserDashboards = () =>
  query<RecentDashboardsQuery>(RECENT_USER_DASHBOARDS_QUERY).then(userDashboardsAccessor)
