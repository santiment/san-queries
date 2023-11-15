import { Universal } from 'webkit/api'

export const DASHBOARD_FRAGMENT = `
id
name
description
isPublic
`

export const queryGetDashboard = Universal(
  (query) => (id: number) =>
    query<SAN.API.Query<'item', App.ApiQuery>>(`{
        item:getDashboard(id:${id}) {
          ${DASHBOARD_FRAGMENT}
          settings
          user {id username avatarUrl}
        }
      }`).then(({ item }) => item),
)

export const queryGetUserDashboards = Universal(
  (query) => () =>
    query<SAN.API.Query<'dashboards', any[]>>(`{
        dashboards:getUserDashboards(page:1, pageSize:100) {
          ${DASHBOARD_FRAGMENT}
        }
      }`).then(({ dashboards }) => dashboards),
)

declare global {
  namespace App {
    type ApiDashboard = {
      id: number
      name: string
      description: string
      isPublic: boolean
      settings: null | Record<string, any>
      user: SAN.Author
    }
  }
}
