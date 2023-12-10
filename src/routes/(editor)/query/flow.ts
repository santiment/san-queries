import { notifications$ } from 'webkit/ui/Notifications'
import { mutateCreateSqlQuery } from '$lib/api/query/create'
import { mutateUpdateSqlQuery } from '$lib/api/query/update'
import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'

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

export function startSaveQueryFlow(
  queryEditor: App.QueryEditorStoreValue,
  isPublic = true,
  isForced = false,
) {
  const { name, description, query, sql, parameters, settings } = queryEditor

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
    isPublic: query?.isPublic ?? isPublic,
    parameters,

    settings: serializeQuerySettings(settings),
  }

  const promise = query
    ? mutateUpdateSqlQuery({ id: query.id, ...variables })
    : mutateCreateSqlQuery(variables)

  return promise.then((apiQuery) => {
    if (isForced) {
      notifications$.show({
        type: 'success',
        title: query?.id ? 'Query saved' : 'New query created',
        description: 'Your work is automatically saved on every change',
        dismissAfter: 5000,
      })
    }

    return apiQuery
  })
}

export function startUpdateQueryEditorFlow(
  queryEditor$: App.QueryEditorStore,
  apiQuery: App.ApiQuery,
) {
  queryEditor$.setApiQuery(apiQuery)

  window.history.replaceState(
    '',
    history.state,
    '/query/' + getSEOLinkFromIdAndTitle(apiQuery.id, apiQuery.name),
  )
}
