import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

export const CTX = 'DashboardEditor$$'

export function DashboardEditor$$() {
  const state = { widgets: [] } as App.DashboardEditor
  const store = writable(state)

  return setContext(CTX, {
    dashboardEditor$: {
      ...store,
      addWidget() {
        state.widgets.push({ type: 'TEXT' })
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
