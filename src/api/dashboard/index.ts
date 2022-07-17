import { query } from 'webkit/api'
import { DASHBOARD_FRAGMENT } from './fragments'

const DASHBOARD_QUERY = (id: number) => `{
  dashboard:getDashboardSchema(id:${id}){
    ${DASHBOARD_FRAGMENT}
  }
}`

const dashboardAccessor = ({ dashboard }) => dashboard
export const queryDashboard = (id: number) =>
  query<any>(DASHBOARD_QUERY(id)).then(dashboardAccessor) as Promise<SAN.Queries.Dashboard>

// -------------------------

const RECENT_USER_DASHBOARDS_QUERY = `{
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

type ShortDashboard = {
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
