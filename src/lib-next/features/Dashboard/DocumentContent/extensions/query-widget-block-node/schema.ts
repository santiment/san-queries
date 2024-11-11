import type { TApiDashboard, TDataWidgetKey } from '$lib-next/features/Dashboard/types'

import { untrack } from 'svelte'
import { SvelteMap } from 'svelte/reactivity'
import { useDashboardDataWidgets } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
import Component from './ui/index.svelte'
import {
  createDataWidgetSchema,
  type TDataWidgetComponent,
  type TDataWidgetNode,
} from '../schema/data-widget'
import { useDashboardSqlQueriesCtx } from './ctx/dashboard-queries.svelte'

export type TColumnActions = SvelteMap<
  string,
  undefined | { label: string; onclick: (value: string) => void }
>

type TSchema = TDataWidgetNode<{
  name: 'query-widget'

  Component: TDataWidgetComponent

  initState(defaultState?: Record<string, any>): {
    isLoading: boolean
    sqlData: null | App.SqlData
    lastFetchedParameterValues: Record<string, any>
    loadSqlData: (isForced: boolean) => void
    __columnActions: TColumnActions
  }

  initData(
    id: TDataWidgetKey,
    allCtxs: Map<string, any>,
  ): {
    sqlQuery: undefined | TApiDashboard<any>['queries'][number]
    outputs: string[]
  }
}>

export const QUERY_WIDGET_BLOCK_NODE: TSchema = createDataWidgetSchema({
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

  initData(id, allCtxs) {
    const { getDashboardSqlQueryById, sqlQueryCachedData } = useDashboardSqlQueriesCtx.get(allCtxs)

    const sqlQuery = untrack(() => getDashboardSqlQueryById(id))
    const cachedData = sqlQueryCachedData.get(id)

    return {
      sqlQuery,
      outputs: cachedData?.columns || [],
    }
  },

  initNodeView(data, schema) {
    if (data.id) {
      return data
    }

    const { createDashboardDataWidget } = useDashboardDataWidgets.get()

    createDashboardDataWidget(
      {
        id: '' as TDataWidgetKey,
        type: schema.name,
        data: null,
        settings: {},
      },
      schema,
    )

    return Promise.resolve(data)
  },
} as const)
