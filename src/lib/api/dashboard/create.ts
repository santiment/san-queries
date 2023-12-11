import { mutate } from 'webkit/api'
// import { serializeParameters } from './utilts'
import { DASHBOARD_FRAGMENT } from './get'

export function mutateCreateDashboard(variables: { name: string; description?: string }) {
  return mutate<SAN.API.Query<'dashboard', App.ApiDashboard>>(
    `mutation ($name: String!, $description: String) {
    dashboard:createDashboard(name:$name, description:$description) {
      ${DASHBOARD_FRAGMENT}
    }
  }`,
    { variables },
  ).then(({ dashboard }) => dashboard)
}

export function mutateUpdateDashboard(
  variables: { id: number } & Partial<{
    name: string
    description: string
    settings: any
    isPublic: boolean
  }>,
) {
  return mutate<SAN.API.Query<'dashboard', App.ApiDashboard>>(
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
  return mutate<SAN.API.Query<'added', { textWidget: App.ApiTextWidget }>>(
    `mutation ($dashboardId: Int!, $value: String) {
    added:addDashboardTextWidget(dashboardId:$dashboardId, body:$value) {
      textWidget {id body}
    }
  }`,
    { variables },
  ).then(({ added }) => added.textWidget)
}

export function mutateUpdateDashboardTextWidget(variables: {
  id: string
  dashboardId: number
  value: string
}) {
  return mutate<SAN.API.Query<'added', { textWidget: App.ApiTextWidget }>>(
    `mutation ($id: String!, $dashboardId: Int!, $value: String) {
    added:updateDashboardTextWidget(textWidgetId:$id, dashboardId:$dashboardId, body:$value) {
      textWidget {id body}
    }
  }`,
    { variables },
  ).then(({ added }) => added.textWidget)
}

export function mutateDeleteDashboardTextWidget(dashboardId: number, widgetId: string) {
  return mutate<SAN.API.Query<'deleted', { textWidget: App.ApiTextWidget }>>(
    `mutation {
    deleted:deleteDashboardTextWidget(dashboardId:${dashboardId}, textWidgetId:${JSON.stringify(
      widgetId,
    )}) {
      textWidget {id}
    }
  }`,
  )
}

// -------

export function mutateCreateDashboardQuery(variables: { dashboardId: number; queryId: number }) {
  return mutate<SAN.API.Query<'created', { id: string }>>(
    `mutation ($dashboardId: Int!, $queryId: Int!) {
    created:createDashboardQuery(dashboardId:$dashboardId, queryId:$queryId) {
      id
    }
  }`,
    { variables },
  ).then(({ created }) => created)
}

export function mutateDeleteDashboardQuery(dashboardId: number, widgetId: string) {
  return mutate<SAN.API.Query<'deleted', { id: string }>>(
    `mutation {
    deleted:deleteDashboardQuery(dashboardId:${dashboardId}, dashboardQueryMappingId:${JSON.stringify(
      widgetId,
    )}) {
      id
    }
  }`,
  )
}
