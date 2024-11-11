import type { TDataWidgetKey } from '$lib-next/features/Dashboard/types'

import { useDashboardDataWidgets } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
import Component from './ui/index.svelte'
import {
  createDataWidgetSchema,
  type TDataWidgetComponent,
  type TDataWidgetNode,
} from '../schema/data-widget'
import { SvelteMap } from 'svelte/reactivity'

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
