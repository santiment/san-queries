import type { TDataWidgetKey } from '$lib-next/features/Dashboard/types'

import { createDataWidgetSchema, type AsyncDataWidgetComponent } from '../schema'
import { useDashboardDataWidgetsFlow } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'

export const QUERY_WIDGET_BLOCK_NODE = createDataWidgetSchema({
  name: 'query-widget',

  importComponent: () => import('./Component.svelte') as AsyncDataWidgetComponent,

  initState(defaultState = {}) {
    return {
      isLoading: false,
      sqlData: defaultState?.sqlData || [],
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
