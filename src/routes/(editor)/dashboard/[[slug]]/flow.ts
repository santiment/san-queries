import {
  mutateAddDashboardTextWidget,
  mutateCreateDashboard,
  mutateCreateDashboardQuery,
  mutateDeleteDashboardQuery,
  mutateDeleteDashboardTextWidget,
  mutateUpdateDashboard,
  mutateUpdateDashboardTextWidget,
} from '$lib/api/dashboard/create'
import { notifications$ } from 'webkit/ui/Notifications'

export const errorify = <T>(promise: Promise<T>): Promise<[T] | [null, { message: string }]> =>
  promise.then((data) => [data] as [T]).catch((e) => [null, Array.isArray(e) ? e[0] : e])

function Diff<T>(type: T, key: 'textWidgets', dashboardEditor: App.DashboardEditorStoreValue) {
  const items = dashboardEditor.widgets.filter((item) => item.type === type)

  const present = new Map<string, App.Dashboard.TextWidget>()
  const removed = new Set<string>()
  const added = new Set()
  const updated = new Set<App.Dashboard.TextWidget>()

  items.forEach((item) => {
    if (item.id) present.set(item.id, item)
    else added.add(item)
  })

  dashboardEditor.dashboard![key].forEach(({ id, body, dashboardQueryMappingId }) => {
    const widgetId = dashboardQueryMappingId || id

    const widget = present.get(widgetId)
    if (widget) {
      if (widget.value !== body) updated.add(widget)
      return
    }

    removed.add(widgetId)
  })

  return { removed: [...removed], added: [...added], updated: [...updated] }
}

export async function startDashboardSaveFlow(dashboardEditor: App.DashboardEditorStoreValue) {
  const { name, description } = dashboardEditor

  if (!name) {
    notifications$.show({
      type: 'error',
      title: "Can't save untitled dashboard",
      description: 'Please add a title to save a dashboard',
      dismissAfter: 5000,
    })

    return Promise.reject()
  }

  if (!dashboardEditor.dashboard) {
    const [dashboard, error] = await errorify(mutateCreateDashboard({ name, description }))
    if (error) return Promise.reject()

    dashboardEditor.dashboard = dashboard
  }

  const { dashboard, widgets, layout } = dashboardEditor
  if (!dashboard) return Promise.reject('Dashboard not found')

  const diffTextWidgets = Diff('TEXT', 'textWidgets', dashboardEditor)

  const diffQueryWidgets = Diff('QUERY', 'queries', dashboardEditor)

  console.log(diffQueryWidgets)

  // throw new Error(123)

  console.log(diffTextWidgets)

  // TODO: Should await removals and updates? [@vanguard | 15 Nov, 2023]
  diffTextWidgets.removed.map((widgetId) => mutateDeleteDashboardTextWidget(dashboard.id, widgetId))
  diffQueryWidgets.removed.map((widgetId) => mutateDeleteDashboardQuery(dashboard.id, widgetId))

  diffTextWidgets.updated.map((widget) =>
    mutateUpdateDashboardTextWidget({
      id: widget.id!,
      dashboardId: dashboard.id,
      value: widget.value,
    }),
  )

  await Promise.all([
    ...diffTextWidgets.added.map((widget) =>
      mutateAddDashboardTextWidget({ dashboardId: dashboard.id, value: widget.value }).then(
        ({ id }) => (widget.id = id),
      ),
    ),

    ...diffQueryWidgets.added.map((widget) =>
      mutateCreateDashboardQuery({ dashboardId: dashboard.id, queryId: widget.query.id }).then(
        ({ id }) => (widget.id = id),
      ),
    ),
  ])

  const settings = {
    version: 2,
    layout: widgets.map((widget, i) => {
      return { id: widget.id, xywh: layout[i].slice(0, 4) }
    }),
  }

  return mutateUpdateDashboard({ id: dashboard.id, settings })
}
