import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

export const CTX = 'DashboardEditor$$'

type Store = {
  dashboard?: null | App.ApiDashboard
  name: string
  description: string
}

function prepareStore(apiDashboard?: null | App.ApiDashboard) {
  const { name = '', description = '' } = apiDashboard || {}

  return {
    dashboard: apiDashboard,

    name,
    description,
  }
}

export function DashboardEditor$$(apiDashboard?: null | App.ApiDashboard) {
  let state = prepareStore(apiDashboard)
  const dashboardEditor$ = writable(state)

  return setContext(CTX, {
    dashboardEditor$: {
      ...dashboardEditor$,
    },
  })
}

export const getDashboardEditor$Ctx = () => getContext(CTX) as ReturnType<typeof DashboardEditor$$>

declare global {
  namespace App {
    type DashboardEditorStore = ReturnType<typeof DashboardEditor$$>['dashboardEditor$']
    type DashboardEditorStoreValue = Store
  }
}
