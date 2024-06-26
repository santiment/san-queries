import { ss, ssd } from 'svelte-runes'
import { Map as Map$ } from 'svelte/reactivity'
import { createCtx } from '$lib/ctx'
import { useDashboardParametersCtx, useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'
import { page as page$ } from '$app/stores'
import { get } from 'svelte/store'
import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
import type { Editor } from '@tiptap/core'
import { createQueryWidget } from './BlockEditor/nodes/QueryBlock/state'
import { untrack } from 'svelte'

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

    let documentContent =
      apiDashboard?.settings?.documentContent || apiDashboard?.settings?.__editorJson

    if (!documentContent) {
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

      documentContent = {
        type: 'doc',
        content: [...textWidgets, ...queryWidgets],
      }
    }

    if (documentContent.content.length === 0) {
      documentContent.content.push({ type: 'paragraph' })
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

        documentContent,
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

      documentContent: blockEditor?.getJSON(),
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

export const useQueryColumnActionsCtx = createCtx('useQueryColumnActionsCtx', () => {
  type TAction = { label: string; onclick: (value: any) => void }

  const queryColumnAction = ss(new Map<string, undefined | Map<string, TAction>>())

  function addColumnAction(queryId: string, columnIndex: number, action: TAction) {
    untrack(() => {
      if (!queryId) return

      const queries = queryColumnAction.$
      const columns = queries.get(queryId) || new Map()

      columns.set(columnIndex.toString(), action)
      queries.set(queryId, new Map(columns))

      queryColumnAction.$ = queries
    })
  }

  function removeColumnAction(queryId: string, columnIndex: number) {
    untrack(() => {
      const columns = queryColumnAction.$.get(queryId)
      if (!columns) return

      columns.delete(columnIndex.toString())
      queryColumnAction.$.set(queryId, new Map(columns))

      queryColumnAction.$ = queryColumnAction.$
    })
  }

  return { queryColumnAction, addColumnAction, removeColumnAction }
})
