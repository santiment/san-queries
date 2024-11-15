import type { TApiDashboard, TDataWidgetKey } from '$lib-next/dashboard/types'

import { untrack } from 'svelte'
import { SvelteMap } from 'svelte/reactivity'
import Component from './ui/index.svelte'
import {
  createDataWidgetSchema,
  type TDataWidgetNode,
  type TDataWidgetSchema,
} from '../schema/data-widget'
import { useDashboardSqlQueriesCtx } from '../../../ctx/dashboard-queries.svelte'

export type TColumnActions = SvelteMap<
  string,
  undefined | { label: string; onclick: (value: string) => void }
>

type TSchema = {
  name: 'query-widget'

  Component: TDataWidgetSchema['Component']

  create: TDataWidgetSchema['create']

  initState(defaultState?: Record<string, any>): {
    isLoading: boolean
    sqlData: null | App.SqlData
    lastFetchedParameterValues: Record<string, any>
    loadSqlData: (isForced: boolean) => void
    __columnActions: TColumnActions
  }

  initSettings(defaultSettings?: Partial<{ sqlQueryId: number }>): {
    sqlQueryId: undefined | number
  }

  initData(
    id: TDataWidgetKey,
    allCtxs: Map<string, any>,
  ): {
    name: string
    sqlQuery: undefined | TApiDashboard<any>['queries'][number]
    inputs: Record<string, any>
    outputs: string[]
  }
}

export const QUERY_WIDGET_BLOCK_NODE: TDataWidgetNode<TSchema> = createDataWidgetSchema({
  name: 'query-widget',

  class: 'my-2 max-h-[1000px] min-h-[208px] column',

  Component,

  initState(defaultState = {}) {
    return {
      isLoading: false,
      sqlData: null,
      lastFetchedParameterValues: {},
      loadSqlData: () => {},
      __columnActions: new SvelteMap() as TColumnActions,
    }
  },

  initSettings({ sqlQueryId } = {}) {
    return { sqlQueryId }
  },

  initData(id, allCtxs) {
    const { getDashboardSqlQueryById, sqlQueryCachedData } = useDashboardSqlQueriesCtx.get(allCtxs)

    const sqlQuery = untrack(() => getDashboardSqlQueryById(id))
    const cachedData = sqlQueryCachedData.get(id)

    return {
      name: sqlQuery?.name || 'SQL Query',
      sqlQuery,
      inputs: sqlQuery?.sqlQueryParameters || {},
      outputs: cachedData?.columns || [],
    }
  },

  create({ id }, view) {
    const attrs = view.$.node.attrs
    // TODO: Create a new query using in node selector when ID is missing
    return {
      id: id || ('' as TDataWidgetKey),
      type: this.name,
      data: null,
      settings: { sqlQueryId: attrs.sqlQueryId },
    }

    // // return Promise.resolve(data)
  },
} as const)
