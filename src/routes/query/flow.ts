import { get } from 'svelte/store'
import { notifications$ } from 'webkit/ui/Notifications'
import { getSavedJson, saveJson } from 'webkit/utils/localStorage'
import { mutateCreateSqlQuery } from '$lib/api/query/create'
import { mutateUpdateSqlQuery } from '$lib/api/query/update'

export function serializeQuerySettings(settings: App.QueryEditorStoreValue['settings']) {
  return {
    ...settings,
    columns: Object.keys(settings.columns).reduce((acc, key) => {
      const { title, formatter } = settings.columns[key]
      acc[key] = { title, formatter: formatter?.key }
      return acc
    }, {} as any),
  } as App.ApiQuery['settings']
}

export function startSaveQueryFlow(queryEditor$: App.QueryEditorStore) {
  const { name, description, query, sql, parameters, settings } = get(queryEditor$)

  if (!name) {
    notifications$.show({
      type: 'error',
      title: 'Untitled query can not be saved',
      dismissAfter: 5000,
    })

    return Promise.reject()
  }

  const variables = {
    name,
    description,
    sql,
    isPublic: true,
    parameters,

    settings: serializeQuerySettings(settings),
  }

  const promise = query
    ? mutateUpdateSqlQuery({ id: query.id, ...variables })
    : mutateCreateSqlQuery(variables)

  return promise.then((apiQuery) => {
    console.log(apiQuery)
    queryEditor$.setApiQuery(apiQuery)

    if (query?.id) {
      const saved = getSavedJson<any[]>('__QUERIES', []) as any
      saved.some((v: any) => {
        if (v.id === apiQuery.id) {
          return Object.assign(v, apiQuery)
        }
      })
      saveJson('__QUERIES', saved)
    } else {
      saveJson('__QUERIES', [...getSavedJson<any>('__QUERIES', []), apiQuery])
    }

    notifications$.show({
      type: 'success',
      title: query?.id ? 'Query saved' : 'New query created',
      description: 'Query is available in "Work" tab',
      dismissAfter: 5000,
    })

    return apiQuery
  })
}
