import { untrack } from 'svelte'
import { ss } from 'svelte-runes'
import { createCtx } from '$lib/ctx'

export function parseWidgets() {}

export const useDashboardWidgetsCtx = createCtx(
  'useDashboardWidgetsCtx',
  ({
    queries = [],
    textWidgets = [],
  }: Partial<Pick<App.ApiDashboard, 'queries' | 'textWidgets'>> = {}) => {
    const widgets = ss([...textWidgets.map(mapTextWidget), ...queries.map(mapQueryWidget)])

    return {
      widgets,
      // createWidget: {
      //   QUERY: () =>
      // },
      addWidget<T extends 'TEXT' | 'QUERY'>(
        type: T,
        data: T extends 'TEXT'
          ? Parameters<typeof mapTextWidget>[0]
          : Parameters<typeof mapQueryWidget>[0],
      ) {
        return untrack(() => {
          // @ts-expect-error
          const widget = type === 'TEXT' ? mapTextWidget(data) : mapQueryWidget(data)

          widgets.$.push(widget)
          widgets.$ = widgets.$

          return widget
        })
      },

      removeWidget(widget: any) {
        return untrack(() => {
          const index = widgets.$.indexOf(widget)
          console.log({ index })
          if (index < 0) return -1

          widgets.$.splice(index, 1)

          return index
        })
      },
    }
  },
)

export function mapTextWidget({ id, body }: App.ApiDashboard['textWidgets'][number]) {
  return { id, type: 'TEXT' as const, value: body }
}

export function mapQueryWidget(query: App.ApiDashboard['queries'][number]) {
  return { id: query.dashboardQueryMappingId, type: 'QUERY' as const, title: query.name, query }
}
