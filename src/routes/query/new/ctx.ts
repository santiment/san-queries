import { queryComputeRawClickhouseQuery } from '$lib/api/query'
import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

export const CTX = 'QueryEditor$$'

export function QueryEditor$$(
  sql = '',
  sqlData = { headers: [], types: [], rows: [] } as App.SqlData,
) {
  let store = { sql, sqlData }
  const queryEditor$ = writable(store)

  return setContext(CTX, {
    queryEditor$: {
      ...queryEditor$,
      querySqlData() {
        return queryComputeRawClickhouseQuery({ sql: store.sql }).then((data) => {
          store.sqlData = data

          queryEditor$.set(store)

          return data
        })
      },
    },
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
