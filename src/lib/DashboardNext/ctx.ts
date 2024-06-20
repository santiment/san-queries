import { ss, ssd } from 'svelte-runes'
import { Map as Map$ } from 'svelte/reactivity'
import { createCtx } from '$lib/ctx'
import { useDashboardParametersCtx } from '$lib/Dashboard/ctx/parameters'

export const useDashboardEditorCtx = createCtx(
  'useDashboardEditorCtx',
  (apiDashboard?: App.ApiDashboard, isAuthor: boolean = false, readonly: boolean = false) => {
    const {
      id,
      name,
      description,
      isPublic,
      panels,
      queries = [],
      textWidgets = [],
    } = apiDashboard || {}

    const isLegacy = Boolean(panels?.length && !(queries.length || textWidgets.length))

    useDashboardWidgets({ queries })
    const { parameters } = useDashboardParametersCtx(apiDashboard?.parameters)

    let __editorJson = apiDashboard?.settings?.__editorJson

    if (!__editorJson) {
      const textWidgets =
        apiDashboard?.textWidgets.map(({ body }) => ({
          type: 'paragraph',
          content: body ? [{ type: 'text', text: body }] : [],
        })) || []

      const queryWidgets =
        apiDashboard?.queries.map((query) => ({
          type: 'query-widget',
          attrs: {
            'data-id': query.dashboardQueryMappingId,
          },
        })) || []

      __editorJson = {
        type: 'doc',
        content: [...textWidgets, ...queryWidgets],
      }
    }

    return {
      dashboardEditor: {
        isAuthor,
        readonly,

        id,
        name: ss(name || ''),
        description: ss(description || ''),
        isPublic: ss(isPublic),
        isLegacy,

        parameters,

        __editorJson,
      },
    }
  },
)

export type TEditorWidget<T = any> = {
  id: string
  type: 'query-widget' | 'asset-selector'
  data: T
  state: Map$<string, null | any>
}

export const useDashboardWidgets = createCtx(
  'useDashboardWidgets',
  (data?: { queries: App.ApiDashboard['queries'] }) => {
    const { queries = [] } = data || {}

    const queryWidgets = queries.map(
      (query) =>
        [
          query.dashboardQueryMappingId,
          {
            id: query.dashboardQueryMappingId,
            type: 'query-widget',
            data: query,
            state: new Map$(),
          },
        ] as const,
    )

    const dashboardWidgets = new Map$<string, null | TEditorWidget>(queryWidgets)

    return {
      dashboardWidgets,
      addQueryWidget(query) {
        dashboardWidgets.set(query.dashboardQueryMappingId, {
          id: query.dashboardQueryMappingId,
          type: 'query-widget',
          data: query,
          state: new Map$(),
        })
      },
    }
  },
)

export function useEditorWidget<T = null>(id: string) {
  const { dashboardWidgets } = useDashboardWidgets()

  return ssd(() => dashboardWidgets.get(id) as TEditorWidget<T>)
}
