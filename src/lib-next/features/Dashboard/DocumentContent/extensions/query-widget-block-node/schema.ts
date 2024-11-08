import type { TDataWidgetKey } from '$lib-next/features/Dashboard/types'

import { useDashboardDataWidgetsFlow } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
import Component from './ui/index.svelte'
import {
  createDataWidgetSchema,
  type TDataWidgetComponent,
  type TDataWidgetNode,
} from '../schema/data-widget'

type T_QUERY_WIDGET_BLOCK_NODE = TDataWidgetNode<{
  name: 'query-widget'

  Component: TDataWidgetComponent

  initState(defaultState?: Record<string, any>): {
    isLoading: boolean
    sqlData: null | App.SqlData
    lastFetchedParameterValues: Record<string, any>
    loadSqlData: (isForced: boolean) => void
  }
}>

export const QUERY_WIDGET_BLOCK_NODE: T_QUERY_WIDGET_BLOCK_NODE = createDataWidgetSchema({
  name: 'query-widget',

  class: 'my-2 max-h-[1000px] min-h-[208px] column',

  Component,

  initState(defaultState = {}) {
    return {
      isLoading: false,
      sqlData: null,
      lastFetchedParameterValues: {},
      loadSqlData: () => {},
    }
  },

  initNodeView(data, schema) {
    if (data.id) {
      return data
    }

    const { createDashboardDataWidget } = useDashboardDataWidgetsFlow.get()

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
