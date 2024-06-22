import { ss, ssd } from 'svelte-runes'
import { Map as Map$ } from 'svelte/reactivity'
import { createCtx } from '$lib/ctx'
import { useDashboardParametersCtx, useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { page as page$ } from '$app/stores'
import { get } from 'svelte/store'
import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
import type { Editor } from '@tiptap/core'
import { createQueryWidget } from './BlockEditor/nodes/QueryBlock/state'

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

    const { parameters } = useDashboardParametersCtx(apiDashboard?.parameters)
    useGlobalParametersCtx()

    let document = apiDashboard?.settings?.__editorJson || ''

    if (!document) {
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

      document = {
        type: 'doc',
        content: [...textWidgets, ...queryWidgets],
      }
    }

    if (document.content.length === 0) {
      document.content.push({ type: 'paragraph' })
    }

    console.log(document)
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

        __editorJson: document,
      },
    }
  },
)

export function unwrapState(
  dashboardEditor: ReturnType<typeof useDashboardEditorCtx>['dashboardEditor'],
  dashboardData?: ReturnType<typeof useDahboardSqlDataCtx>['dashboardData'],

  blockEditor?: null | Editor,
) {
  const { id, name, description, isPublic, parameters, isLegacy } = dashboardEditor

  console.log(blockEditor?.getJSON())

  return {
    id,
    name: name.$,
    description: description.$,
    isPublic: isPublic.$,

    parameters: parameters.$,

    isLegacy,
    settings: {
      version: 2,

      __editorJson: blockEditor?.getJSON(),
    },

    queriesData: Array.from(dashboardData?.values() || []).map((data) =>
      Object.assign({}, data.defaultData.$),
    ),
  }
}

export type TEditorWidget<T = any> = {
  id: string
  type: 'query-widget' | 'asset-selector'
  data: T
  state: Map$<string, null | any>
}

export const useDashboardWidgets = createCtx(
  'useDashboardWidgets',
  (
    data?: { queries: App.ApiDashboard['queries'] },
    dashboardData?: ReturnType<typeof useDahboardSqlDataCtx>['dashboardData'],
  ) => {
    const { queries = [] } = data || {}
    console.log(dashboardData)

    const queryWidgets = queries.map(
      (query) => [query.dashboardQueryMappingId, createQueryWidget(query, dashboardData)] as const,
    )

    const dashboardWidgets = new Map$<string, null | TEditorWidget>(queryWidgets)

    return {
      dashboardWidgets,
      addQueryWidget(query: App.ApiDashboard['queries'][number]) {
        dashboardWidgets.set(query.dashboardQueryMappingId, createQueryWidget(query, dashboardData))
      },
    }
  },
)

export function useEditorWidget<T = null>(id: string) {
  const { dashboardWidgets } = useDashboardWidgets()

  return ssd(() => dashboardWidgets.get(id) as TEditorWidget<T>)
}

export const useServerDashboardCacheCtx = createCtx('useServerDashboardCacheCtx', () => {
  const state = new Map<string, undefined | { isLoading: false; default: App.SqlData }>()

  const data = get(page$).data?.serverDashboardCache || []

  for (const cache of data) {
    state.set(cache.dashboardQueryMappingId, { isLoading: false, default: cache })
  }

  return state
})
