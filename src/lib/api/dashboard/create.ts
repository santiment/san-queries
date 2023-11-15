import { mutate } from 'webkit/api'
// import { serializeParameters } from './utilts'
import { DASHBOARD_FRAGMENT } from './get'

export function mutateCreateDashboard(variables: { name: string; description?: string }) {
  return mutate<SAN.API.Query<'createDashboard', any>>(
    `mutation createDashboard($name: String!, $description: String) {
    createDashboard(name:$name, description:$description) {
      ${DASHBOARD_FRAGMENT}
    }
  }`,
    {
      variables: {
        ...variables,
      },
    },
  ).then(({ createDashboard }) => createDashboard)
}

export function mutateAddDashboardTextWidget(variables: { dashboardId: number; value: string }) {
  return mutate<SAN.API.Query<'addDashboardTextWidget', any>>(
    `mutation addDashboardTextWidget($dashboardId: Int!, $value: String) {
    addDashboardTextWidget(dashboardId:$dashboardId, body:$value) {
      textWidget {id body}
    }
  }`,
    {
      variables: {
        ...variables,
      },
    },
  ).then(({ addDashboardTextWidget }) => addDashboardTextWidget.textWidget)
}

export function mutateDeleteDashboardTextWidget(dashboardId: number, widgetId: string) {
  return mutate<SAN.API.Query<'deleted', any>>(
    `mutation {
    deleted:deleteDashboardTextWidget(dashboardId:${dashboardId}, textWidgetId:${JSON.stringify(
      widgetId,
    )}) {
      textWidget {id}
    }
  }`,
  )
}
