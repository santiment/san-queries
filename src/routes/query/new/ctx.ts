import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

export const CTX = 'QueryEditor$$'

export function QueryEditor$$(sql = '') {
  const store = writable({ sql })

  return setContext(CTX, {
    queryEditor$: store,
  })
}

export const getQueryEditor$Ctx = () => getContext(CTX) as ReturnType<typeof QueryEditor$$>

// type DashboardEditorType = {
//   widgets: App.Dashboard.Widget[]
// }
// type DashboardEditor$Type = ReturnType<typeof DashboardEditor$$>['dashboardEditor$']
//
// declare global {
//   namespace App {
//     namespace Dashboard {
//       type Controller = DashboardEditorType
//       type ControllerStore = DashboardEditor$Type
//     }
//   }
// }
