import { mutate } from 'webkit/api'
// import { serializeParameters } from './utilts'
import { DASHBOARD_FRAGMENT } from './get'

export function mutateCreateDashboard(variables: { name: string; description?: string }) {
  return mutate<SAN.API.Query<'dashboard', any>>(
    `mutation ($name: String!, $description: String) {
    dashboard:createDashboard(name:$name, description:$description) {
      ${DASHBOARD_FRAGMENT}
    }
  }`,
    { variables },
  ).then(({ createDashboard }) => createDashboard)
}

export function mutateUpdateDashboard(
  variables: { id: number } & Partial<{ name: string; description: string; settings: any }>,
) {
  return mutate<SAN.API.Query<'dashboard', any>>(
    `mutation ($id:Int!, $name: String, $description: String, $isPublic: Boolean, $settings:json) {
    dashboard:updateDashboard(id:$id, name:$name, description:$description, isPublic:$isPublic, settings:$settings) {
      ${DASHBOARD_FRAGMENT}
    }
  }`,
    {
      variables: {
        ...variables,
        settings: variables?.settings && JSON.stringify(variables.settings),
      },
    },
  ).then(({ dashboard }) => dashboard)
}

// ---

export function mutateAddDashboardTextWidget(variables: { dashboardId: number; value: string }) {
  return mutate<SAN.API.Query<'added', any>>(
    `mutation ($dashboardId: Int!, $value: String) {
    added:addDashboardTextWidget(dashboardId:$dashboardId, body:$value) {
      textWidget {id body}
    }
  }`,
    {
      variables: {
        ...variables,
      },
    },
  ).then(({ added }) => added.textWidget)
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
