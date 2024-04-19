import { createCtx } from '$lib/ctx'
import type { SS } from 'svelte-runes'
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

    let defaultParameters = null as null | Record<string, any>
    let oldParameters = null as null | Record<string, any>
    let newParameters = null as null | Record<string, any>

    const changedParameters = new Map$<string, any>()

    $effect(() => {
      const inputs$ = flowNode?.$?.inputs$

      untrack(() => {
        const subscriber = inputs$?.subscribe((editedParameters) => {
          if (!oldParameters) {
            defaultParameters = oldParameters = editedParameters
            return
          }

          for (const parameterKey in editedParameters) {
            const newValue = editedParameters[parameterKey]
            if (hashValue(newValue as any) === hashValue(oldParameters![parameterKey])) {
              changedParameters.delete(parameterKey)
            } else changedParameters.set(parameterKey, newValue)
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
        const widgetParameters = widget.query.sqlQueryParameters

        // NOTE: Should it be done for defaults during init?
        const dashboardWidgetParameters = Object.keys(widgetParameters).reduce(
          (acc, key) =>
            Object.assign(acc, {
              [key]:
                globalParameterOverrides.$.get(widget.id, key)?.[0]?.value || widgetParameters[key],
            }),
          {},
        )

        // NOTE: Ensuring order of key-value pairs
        const newSqlParameters = Object.assign({}, dashboardWidgetParameters, newParameters)
        const newHash = JSON.stringify(newSqlParameters)
        const defaultHash = JSON.stringify(dashboardWidgetParameters)

        queryRawSql({
          widgetId: widget.id,
          sql: widget.query.sqlQueryText,
          parameters: newSqlParameters,
          isDefault: defaultHash === newHash,
          onComplete,
        })

        function onComplete() {
          oldParameters = newParameters
          changedParameters.clear()
        }
      })

    return { changedParameters, mountRefreshPrompt, queryParameterChanges }
  },
)
