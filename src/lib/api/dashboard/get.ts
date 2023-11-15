import { Universal } from 'webkit/api'

export const DASHBOARD_FRAGMENT = `
id
name
description
isPublic
`

export const queryGetDashboard = Universal(
  (query) => (id: number) =>
    query<SAN.API.Query<'query', App.ApiQuery>>(`{
        query:getDashboard(id:${id}) {
          ${DASHBOARD_FRAGMENT}
        }
      }`).then(({ query }) => query),
)

export const queryGetUserDashboards = Universal(
  (query) => () =>
    query<SAN.API.Query<'dashboards', any[]>>(`{
        dashboards:getUserDashboards(page:1, pageSize:100) {
          ${DASHBOARD_FRAGMENT}
        }
      }`).then(({ dashboards }) => dashboards),
)
