import { query } from 'san-webkit/lib/api'
import { mutateCreateSqlQuery } from '../query/create'
import { mutateCreateDashboardQuery } from './create'

export async function startLegacyMigrationFlow(dashboard: App.ApiDashboard) {
  const { id, panels } = dashboard

  if (!panels) return Promise.reject()

  return Promise.all(
    panels?.map(({ name, sql }) => {
      const parameters = Object.keys(sql.parameters).map((key) => {
        return { key, value: sql.parameters[key] }
      })

      return mutateCreateSqlQuery({
        name,
        sql: sql.query,
        parameters,
      }).then((query) => {
        // dashboard.queries.push(query)
        return mutateCreateDashboardQuery({
          dashboardId: id,
          queryId: query.id,
        })
      })
    }),
  )
}

export const queryLegacyDashboardCache = (id: number) =>
  query<any>(`{
  cache:getDashboardCache(id:${id}) {
    panels {
      id
      headers:columns
      rows
      types:columnTypes
    }
  }
}`).then((data) => data.cache.panels)
