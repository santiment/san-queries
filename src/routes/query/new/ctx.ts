import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { queryComputeRawClickhouseQuery } from '$lib/api/query'
import { serializeParameters } from '$lib/api/query/utilts'
import { Formatter } from '$lib/QueryEditor/Visualisation/Controls/FormattingControl.svelte'

export const CTX = 'QueryEditor$$'

type Store = {
  query?: null | App.ApiQuery

  name: string
  description: string

  sql: string
  parameters: App.Parameter[]
  sqlData: App.SqlData
  sqlErrors: App.SqlError[]

  settings: {
    columns: Record<
      string,
      | undefined
      | Partial<{
          title: string
          formatter: any
        }>
    >
  }
}

function parseQuerySettings(querySettings: App.ApiQuery['settings']) {
  const settings = {
    columns: {},
  }

  if (!querySettings) return settings

  if (querySettings.columns) {
    Object.keys(querySettings.columns).forEach((key) => {
      const { title, formatter } = querySettings.columns[key]

      settings.columns[key] = {
        title,
        formatter: Formatter[formatter],
      }
    })
  }

  return settings
}

function prepareStore(apiQuery?: null | App.ApiQuery, sql = '') {
  const { name = '', description = '', settings, sqlQueryText, sqlQueryParameters } = apiQuery || {}

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
    sqlErrors: [],

    settings: parseQuerySettings(settings),
  }
}

export function QueryEditor$$(apiQuery?: null | App.ApiQuery, sql = '') {
  let store = prepareStore(apiQuery, sql) as Store
  const queryEditor$ = writable<Store>(store)

  return setContext(CTX, {
    queryEditor$: {
      ...queryEditor$,
      setApiQuery(apiQuery: App.ApiQuery) {
        const { sqlData, sqlErrors } = store

        store = prepareStore(apiQuery)
        store.sqlData = sqlData
        store.sqlErrors = sqlErrors

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

      updateSettings(column: string, value: any) {
        store.settings.columns[column] = { ...store.settings.columns[column], ...value }

        queryEditor$.set(store)
      },

      addError(error: App.SqlError) {
        store.sqlErrors.push(error)

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
    type QueryEditorStoreValue = Store
  }
}
