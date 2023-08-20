import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

export const CTX = 'DashboardEditor$$'

export function DashboardEditor$$(defaultWidgets = [] as App.Dashboard.Widget[]) {
  const state = { widgets: defaultWidgets }
  const store = writable(state)

  return setContext(CTX, {
    dashboardEditor$: {
      ...store,
      addWidget(widget: App.Dashboard.Widget) {
        state.widgets.push(widget)
        store.set(state)
      },
      removeWidget(widget: App.Dashboard.Widget) {
        state.widgets = state.widgets.filter((item) => item !== widget)
        store.set(state)
      },
    },
  })
}

export const getDashboardEditor$Ctx = () => getContext(CTX) as ReturnType<typeof DashboardEditor$$>

type DashboardEditorType = {
  widgets: App.Dashboard.Widget[]
}
type DashboardEditor$Type = ReturnType<typeof DashboardEditor$$>['dashboardEditor$']

declare global {
  namespace App {
    namespace Dashboard {
      type Controller = DashboardEditorType
      type ControllerStore = DashboardEditor$Type
    }
  }
}
