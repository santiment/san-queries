import { notifications$ } from 'webkit/ui/Notifications'
import { mutateCreateDashboard, mutateCreateDashboardPanel } from '@/api/dashboard/create'
import { mutateRemoveDashboardPanel } from '@/api/dashboard/remove'
import { mutateUpdateDashboard, mutateUpdateDashboardPanel } from '@/api/dashboard/update'
import { getParametersMap } from '@/utils/parameters'

export function startSaveDashboardFlow(dashboard: SAN.Queries.Dashboard) {
  const { id, settings } = dashboard

  const mutation = id ? mutateUpdateDashboard : mutateCreateDashboard
  return mutation({ ...dashboard, settings: JSON.stringify(settings) }).then((updated) => {
    Object.assign(dashboard, updated)
    return dashboard
  })
}

export function startSavePanelFlow(
  panel: SAN.Queries.DashboardPanel,
  dashboard: SAN.Queries.Dashboard,
) {
  const { id: dashboardId, settings } = dashboard
  const { id, name, type, xAxisKey } = panel as any

  const mutation = id ? mutateUpdateDashboardPanel : mutateCreateDashboardPanel
  return mutation({
    dashboardId,
    panelId: id,
    name,
    sql: {
      query: settings.sql,
      parameters: JSON.stringify(getParametersMap(settings.parameters)),
    },
    settings: JSON.stringify({
      type,
      xAxisKey,
    }),
  }).then((updated) => {
    panel.id = updated.id
    return updated
  })
}

export function startRemoveDashboardPanelsFlow(dashboard: SAN.Queries.Dashboard) {
  const { id, removedPanels } = dashboard
  return Promise.all(removedPanels.map((panel) => mutateRemoveDashboardPanel(id, panel.id))).then(
    () => {
      removedPanels.length = 0
    },
  )
}

export function startSaveFlow(dashboard: SAN.Queries.Dashboard) {
  return startSaveDashboardFlow(dashboard)
    .then((dashboard) => {
      const { panels } = dashboard
      return Promise.all(
        panels
          .map((panel) => startSavePanelFlow(panel, dashboard))
          .concat(startRemoveDashboardPanelsFlow(dashboard) as any),
      )
    })
    .then(() => {
      notifications$.show({
        type: 'success',
        title: 'Dashboard was saved successfully',
      })
      console.log('Sucess????')
      return dashboard
    })
    .catch((e) => {
      notifications$.show({
        type: 'error',
        title: 'Failed to save the dashboard. Please try again',
      })
      return Promise.reject(e)
    })
}
