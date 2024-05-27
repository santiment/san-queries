import { createCtx } from '$lib/ctx'
import { ssd, type SS } from 'svelte-runes'
import type { QueryWidgetFlowNode } from '../nodes/QueryWidgetFlowNode'
import { Map as Map$ } from 'svelte/reactivity'
import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
import { useDashboardParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { untrack } from 'svelte'

const hashValue = (value: number | string | number[] | string[]) =>
  Array.isArray(value)
    ? Array.from(new Set(value as any[]))
        .sort()
        .join(', ')
    : value

export const useDataFlowSqlDataCtx = createCtx(
  'useDataFlowSqlDataCtx',
  (widget: App.Dashboard.QueryWidget, flowNode?: SS<undefined | QueryWidgetFlowNode>) => {
    const { queryRawSql } = useDahboardSqlDataCtx()
    const { globalParameterOverrides } = useDashboardParametersCtx()

    const defaultParameters = ssd(
      () =>
        Object.assign(
          {},
          widget.query.sqlQueryParameters,
          globalParameterOverrides.$.widgetParams[widget.id],
        ) || {},
    )
    let oldParameters = defaultParameters.$
    let newParameters = null as null | Record<string, any>

    const changedParameters = new Map$<string, any>()

    $effect(() => {
      const inputs$ = flowNode?.$?.inputs$

      untrack(() => {
        const subscriber = inputs$?.subscribe((editedParameters) => {
          for (const parameterKey in editedParameters) {
            let newValue = editedParameters[parameterKey]
            if (Array.isArray(newValue) && newValue.length === 0) {
              newValue = defaultParameters.$[parameterKey]
            }

            if (hashValue(newValue as any) === hashValue(oldParameters![parameterKey])) {
              changedParameters.delete(parameterKey)
            } else {
              changedParameters.set(parameterKey, newValue)
            }
          }

          newParameters = editedParameters
        })
        return () => subscriber?.unsubscribe()
      })
    })

    function mountRefreshPrompt(node: HTMLElement) {
      setTimeout(() => {
        node.parentElement!.classList.add('fill-green', 'text-green', 'bg-green-light-1')
        node.style.maxWidth = '100px'
        node.style.opacity = '1'
      }, 50)
    }

    const queryParameterChanges = () =>
      untrack(() => {
        // NOTE: Ensuring order of key-value pairs
        const newSqlParameters = Object.assign({}, defaultParameters.$, newParameters)
        // Normalizing
        for (const [key, value] of Object.entries(newSqlParameters)) {
          if (Array.isArray(value) && value.length === 0) {
            newSqlParameters[key] = defaultParameters.$[key]
          }
        }

        const newHash = JSON.stringify(newSqlParameters)
        const defaultHash = JSON.stringify(defaultParameters.$)

        queryRawSql({
          widgetId: widget.id,
          sql: widget.query.sqlQueryText,
          parameters: newSqlParameters,
          isDefault: defaultHash === newHash,
          onComplete,
        })

        function onComplete() {
          oldParameters = newSqlParameters
          changedParameters.clear()
        }
      })

    return { changedParameters, mountRefreshPrompt, queryParameterChanges }
  },
)
