import { useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { createCtx } from '$lib/ctx'
import { untrack } from 'svelte'
import { ss } from 'svelte-runes'
import { useDashboardEditorCtx, useDashboardWidgets, type TEditorWidget } from './ctx'
import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'

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
