import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

export const CTX = 'DashboardEditor$$'

export function DashboardEditor$$(defaultWidgets = []) {
  const state = { widgets: defaultWidgets } as App.DashboardEditor
  const store = writable(state)

  return setContext(CTX, {
    dashboardEditor$: {
      ...store,
      addWidget(type = 'TEXT') {
        state.widgets.push({ type })
        store.set(state)
      },
      removeWidget(widget: any) {
        state.widgets = state.widgets.filter((item) => item !== widget)
        store.set(state)
      },
    },
  })
}

export const getDashboardEditor$Ctx = () => getContext(CTX) as ReturnType<typeof DashboardEditor$$>

export type DashboardEditorType = {
  widgets: { type: string }[]
}

export type DashboardEditor$Type = ReturnType<typeof DashboardEditor$$>['dashboardEditor$']

declare namespace App {
  type DashboardEditor = DashboardEditorType
  type DashboardEditorStore = DashboardEditor$Type
}
