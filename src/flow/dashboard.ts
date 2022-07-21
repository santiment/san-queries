import { mutateCreateDashboard, mutateCreateDashboardPanel } from '@/api/dashboard/create'
import { mutateUpdateDashboard, mutateUpdateDashboardPanel } from '@/api/dashboard/update'
import { getParametersMap } from '@/utils/parameters'

export function startSaveDashboardFlow(dashboard) {
  const { id, settings } = dashboard

  const mutation = id ? mutateUpdateDashboard : mutateCreateDashboard
  return mutation({ ...dashboard, settings: JSON.stringify(settings) }).then((updated) => {
    Object.assign(dashboard, updated)
    return updated
  })
}

export function startSavePanelFlow(panel, dashboard) {
  const { id: dashboardId, settings } = dashboard
  const { id, name, type, xAxisKey } = panel

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
