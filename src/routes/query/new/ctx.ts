import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { queryComputeRawClickhouseQuery } from '$lib/api/query'
import { serializeParameters } from '$lib/api/query/utilts'

export const CTX = 'QueryEditor$$'

type Store = {
  query?: App.ApiQuery

  name: string
  description: string

  sql: string
  parameters: App.Parameter[]
  sqlData: App.SqlData
}

function prepareStore(apiQuery?: null | App.ApiQuery, sql = '') {
  const { name = '', description = '', sqlQueryText, sqlQueryParameters } = apiQuery || {}

  return {
    query: apiQuery,

    name,
    description,
    sql: sqlQueryText || sql,
    parameters: sqlQueryParameters
      ? Object.keys(sqlQueryParameters).map((key) => {
          const value = sqlQueryParameters[key]
          return { key, value, type: Number.isFinite(value) ? 'Number' : 'Text' }
        })
      : [],
    sqlData: { headers: [], types: [], rows: [] },
  } as Store
}

export function QueryEditor$$(apiQuery?: null | App.ApiQuery, sql = '') {
  let store = prepareStore(apiQuery, sql)
  const queryEditor$ = writable(store)

  return setContext(CTX, {
    queryEditor$: {
      ...queryEditor$,
      setApiQuery(apiQuery: App.ApiQuery) {
        store = prepareStore(apiQuery)
        queryEditor$.set(store)
      },
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

      updateParameters() {
        store.parameters = store.parameters.slice()
        queryEditor$.set(store)
      },
    },
  })
}

export const getQueryEditor$Ctx = () => getContext(CTX) as App.ReturnType<typeof QueryEditor$$>

// type DashboardEditorType = {
//   widgets: App.Dashboard.Widget[]
// }
// type DashboardEditor$Type = ReturnType<typeof DashboardEditor$$>['dashboardEditor$']
//
declare global {
  namespace App {
    type QueryEditorStore = ReturnType<typeof QueryEditor$$>['queryEditor$']
  }
}
