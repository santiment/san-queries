import { notifications$ } from 'webkit/ui/Notifications'
import { setQueryDashboardCache } from '@/api/dashboard'
import { mutateCreateDashboard, mutateCreateDashboardPanel } from '@/api/dashboard/create'
import { mutateRemoveDashboardPanel } from '@/api/dashboard/remove'
import { mutateUpdateDashboard, mutateUpdateDashboardPanel } from '@/api/dashboard/update'
import { getParametersMap } from '@/utils/parameters'
import { myDashboards$ } from '@/stores/dashboards'
import { shareColumn } from '@/utils/columns'

export function startSaveDashboardFlow(dashboard: SAN.Queries.Dashboard) {
  const mutation = dashboard.id ? mutateUpdateDashboard : mutateCreateDashboard
  return mutation(dashboard as any).then((updated) => {
    Object.assign(dashboard, updated)
    return dashboard
  })
}

export function startSavePanelFlow(panel: SAN.Queries.Panel, dashboard: SAN.Queries.Dashboard) {
  const { id: dashboardId } = dashboard
  const { id, name, settings, sql } = panel
  const { type, columns, xAxisKey } = settings

  const mutation = id ? mutateUpdateDashboardPanel : mutateCreateDashboardPanel
  return mutation({
    dashboardId,
    panelId: id,
    name,
    sql: {
      query: sql.query,
      parameters: JSON.stringify(getParametersMap(sql.parameters)),
    },
    settings: JSON.stringify({
      type,
      xAxisKey,
      columns: columns.map(shareColumn),
      parameters: sql.parameters.map(({ type }) => ({ type })),
    }),
  } as any).then((updated) => {
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

type NormalizedDashboard = { __normalized: boolean } & SAN.Queries.Dashboard
export function startSaveFlow(dashboard: SAN.Queries.Dashboard) {
  return startSaveDashboardFlow(dashboard)
    .then(({ __normalized, ...dashboard }: NormalizedDashboard) => {
      startRemoveDashboardPanelsFlow(dashboard)

      const { panels } = dashboard
      return Promise.all(panels.map((panel) => startSavePanelFlow(panel as any, dashboard))).then(
        (panels) => {
          dashboard.panels = panels
          return dashboard
        },
      )
    })
    .then((dashboard) => {
      setQueryDashboardCache(dashboard.id, dashboard)
      myDashboards$.refetch()
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
