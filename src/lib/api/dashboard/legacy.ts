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
