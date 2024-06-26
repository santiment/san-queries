import type { Editor } from '@tiptap/core'
import { getSavedJson, saveJson } from 'san-webkit/lib/utils/localStorage'
import { createCtx } from 'san-webkit-next/utils'
import { untrack } from 'svelte'
import { ss } from 'svelte-runes'
import { useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
import { useDashboardEditorCtx, useDashboardWidgets, type TEditorWidget } from './ctx'

export const useDataRefreshPromptCtx = createCtx('useDataRefreshPromptCtx', () => {
  const { dashboardEditor } = useDashboardEditorCtx()
  const { queryRawSql } = useDahboardSqlDataCtx()
  const { dashboardWidgets } = useDashboardWidgets()
  const changeIndicatorCtx = useChangeIndicatorCtx()

  const { globalParameterByOverrides } = useGlobalParametersCtx()
  const changedParameters = ss(new Map<string, undefined | string>())

  let currentValues = null as null | [string, string][]
  let newValues = null as typeof currentValues

  $effect(() => {
    const parameters = globalParameterByOverrides.$

    if (!currentValues) {
      currentValues = unwrapParameters(parameters)
      return
    }

    const timer = untrack(() =>
      setTimeout(() => {
        const diff = new Map<string, undefined | string>(currentValues)
        const unsetParameters = new Set(diff.keys())

        newValues = unwrapParameters(parameters)

        newValues.forEach(([key, value]) => {
          const currentValue = diff.get(key)
          unsetParameters.delete(key)

          if (currentValue === value) {
            return diff.delete(key)
          }

          return diff.set(key, value)
        })

        for (const key of unsetParameters) {
          diff.set(key, undefined)
        }

        changedParameters.$ = diff
      }, 300),
    )
    return () => clearTimeout(timer)
  })

  function unwrapParameters(parameters: (typeof globalParameterByOverrides)['$']) {
    return [...parameters].map(([key, parameter]) => [key, parameter.value] as [string, string])
  }

  function queryParameterChanges() {
    untrack(() => {
      const { readonly } = dashboardEditor
      const globalParameters = globalParameterByOverrides.$ // changedParameters.$
      const queryWidgets = Array.from(dashboardWidgets.values()).filter(
        (widget): widget is TEditorWidget<App.ApiQuery> => widget?.type === 'query-widget',
      )

      queryWidgets.forEach((widget) => {
        const widgetParameters = { ...widget.data.sqlQueryParameters }

        for (const paramKey in widgetParameters) {
          const globalKey = widget.id + ',' + paramKey
          const globalParameter = globalParameters.get(globalKey)
          widgetParameters[paramKey] = globalParameter?.value || widgetParameters[paramKey]
        }

        queryRawSql({
          widgetId: widget.id,
          sql: widget.data.sqlQueryText,
          parameters: widgetParameters,
          isDefault: readonly ? false : true,
          readonly,
        })
      })

      currentValues = newValues
      changedParameters.$ = new Map()

      changeIndicatorCtx.emit.changed()
    })
  }

  return { changedParameters, queryParameterChanges }
})

export function usePersistentSessionFlow(getEditor: () => Editor | null) {
  type TSavedSession = { globalParameters: { key: string; value: any }[] }
  const getLocalStorageKey = () => 'local-dashboard-session-' + id!

  const { queryParameterChanges } = useDataRefreshPromptCtx()
  const { dashboardEditor } = useDashboardEditorCtx()
  const { id, readonly, parameters } = dashboardEditor

  let debounceTimer: number
  const applySavedSession = ss<null | (() => void)>()

  function saveLocalSession() {
    untrack(() => {
      if (readonly === false) return

      applySavedSession.$ = null

      debounceTimer = window.setTimeout(() => {
        const editor = getEditor()
        if (!editor) return

        const globalParameters = parameters.$.map(({ key, value }) => ({ key, value }))

        saveJson<TSavedSession>(getLocalStorageKey(), { globalParameters })
      }, 500)
    })
  }

  $effect(() => () => clearTimeout(debounceTimer))

  $effect(() =>
    untrack(() => {
      if (readonly === false) return

      const savedSession = getSavedJson<TSavedSession>(getLocalStorageKey())
      if (!savedSession) return

      console.log(savedSession)

      applySavedSession.$ = () => {
        const editor = getEditor()
        if (!editor) return

        const savedParameters = new Map(
          savedSession.globalParameters.map((parameter) => [parameter.key, parameter.value]),
        )

        for (const parameter of parameters.$) {
          const savedValue = savedParameters.get(parameter.key)
          if (savedValue !== undefined) parameter.value = savedValue
        }

        parameters.$ = parameters.$
        applySavedSession.$ = null

        setTimeout(() => {
          queryParameterChanges()
        }, 600)
      }
    }),
  )

  return {
    saveLocalSession,
    applySavedSession,
  }
}
