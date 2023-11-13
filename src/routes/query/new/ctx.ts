import { queryComputeRawClickhouseQuery } from '$lib/api/query'
import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

export const CTX = 'QueryEditor$$'

function serializeParameters(parameters: App.Parameter[]) {
  return JSON.stringify(
    parameters.reduce((acc, parameter) => {
      acc[parameter.key] = parameter.value
      return acc
    }, {} as Record<string, any>),
  )
}

export function QueryEditor$$(
  sql = '',
  sqlData = { headers: [], types: [], rows: [] } as App.SqlData,
  parameters = [] as App.Parameter[],
) {
  let store = { sql, sqlData, parameters }
  const queryEditor$ = writable(store)

  return setContext(CTX, {
    queryEditor$: {
      ...queryEditor$,
      querySqlData() {
        return queryComputeRawClickhouseQuery({
          sql: store.sql.trim(),
          parameters: serializeParameters(store.parameters),
        }).then((data) => {
          store.sqlData = data

          queryEditor$.set(store)

          return data
        })
      },

      setSql(sql: (typeof store)['sql']) {
        store.sql = sql
        queryEditor$.set(store)
      },

      addParameter(parameter: App.Parameter) {
        store.parameters.push(parameter)
        queryEditor$.set(store)
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
