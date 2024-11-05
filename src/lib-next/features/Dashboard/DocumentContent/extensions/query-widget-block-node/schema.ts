import type { ViewProps } from 'tiptap-svelte-adapter'
import type { TDataWidgetKey } from '$lib-next/features/Dashboard/types'

import { createDataWidgetSchema } from '../schema'
import type { Component as SvelteComponent } from 'svelte'
import Component from './Component.svelte'

export const QUERY_WIDGET_BLOCK_NODE = createDataWidgetSchema<TQueryWidgetBlockSchema>({
  name: 'query-widget',
  Component,

  initState(defaultState = {}) {
    return {
      isLoading: false,
      sqlData: defaultState?.sqlData || [],
    }
  },

  initData(view) {
    const { 'data-id': id, queryId } = view.$.node.attrs

    console.log({ id, queryId })

    if (id) {
      return {
        dashboardQueryMappingId: id as TDataWidgetKey,
      }
    }

    return Promise.resolve({} as any)
  },

  //   initSettings(defaultSettings: Partial<{ test: number }> = {}) {
  //     return { test: defaultSettings.test || 213 }
  //   },
})

type TDataReturn = { dashboardQueryMappingId: TDataWidgetKey }
type TQueryWidgetBlockSchema = {
  name: 'query-widget'
  Component: SvelteComponent<any>

  // data?: {
  //   sqlQuery:TApiDashboard
  // }

  initState(defaultState?: Partial<{ sqlData: any[] }>): {
    isLoading: boolean
    sqlData: (null | number | string)[][]
  }

  initData(view: ViewProps['view']): TDataReturn | Promise<TDataReturn>
}
