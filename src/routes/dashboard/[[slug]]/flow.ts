import {
  mutateAddDashboardTextWidget,
  mutateCreateDashboard,
  mutateDeleteDashboardTextWidget,
} from '$lib/api/dashboard/create'
import { notifications$ } from 'webkit/ui/Notifications'

export const errorify = <T>(promise: Promise<T>): Promise<[T] | [null, { message: string }]> =>
  promise.then((data) => [data] as [T]).catch((e) => [null, Array.isArray(e) ? e[0] : e])

function Diff<T>(type: T, key: 'textWidgets', dashboardEditor: App.DashboardEditorStoreValue) {
  const items = dashboardEditor.widgets.filter((item) => item.type === type)

  const present = new Set()
  const removed = new Set<string>()
  const added = new Set()

  items.forEach((item) => {
    if (item.id) present.add(item.id)
    else added.add(item)
  })

  dashboardEditor.dashboard![key].forEach(({ id }) => {
    if (present.has(id)) return

    removed.add(id)
  })

  return { removed: [...removed], added: [...added] }
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

  const { dashboard } = dashboardEditor
  if (!dashboard) return Promise.reject()

  const diffTextWidgets = Diff('TEXT', 'textWidgets', dashboardEditor)

  console.log(diffTextWidgets)

  // diffTextWidgets.added.map((widget) =>
  //   mutateAddDashboardTextWidget({ dashboardId: dashboard.id, value: widget.value }),
  // )
  //
  diffTextWidgets.removed.map((widgetId) => mutateDeleteDashboardTextWidget(dashboard.id, widgetId))
}
