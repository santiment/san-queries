import { untrack } from 'svelte'
import { ss } from 'svelte-runes'
import { createCtx } from '$lib/ctx'

export function parseWidgets() {}

export const useDashboardWidgetsCtx = createCtx(
  'useDashboardWidgetsCtx',
  (
    {
      queries = [],
      textWidgets = [],
    }: Partial<Pick<App.ApiDashboard, 'queries' | 'textWidgets'>> = {},
    dataFlowSettings?: {} = {},
  ) => {
    const widgets = ss([
      ...textWidgets.map(mapTextWidget),
      ...queries.map(mapQueryWidget),
      ...(dataFlowSettings?.layoutWidgets || []).map(mapCustomWidget).filter(Boolean),
    ] as (App.Dashboard.QueryWidget | App.Dashboard.TextWidget)[])

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
          // const widget = type === 'TEXT' ? mapTextWidget(data) : mapQueryWidget(data)
          let widget //= type === 'TEXT' ? mapTextWidget(data) : mapQueryWidget(data)

          if (type === 'TEXT') {
            widget = mapTextWidget(data)
          } else if (type === 'QUERY') {
            widget = mapQueryWidget(data)
          } else if (type === 'ASSET_SELECTOR') {
            widget = mapAssetSelectorWidget(data)
          }

          if (!widget) return null

          widgets.$.push(widget)
          widgets.$ = widgets.$

          return widget
        })
      },

      removeWidget(widget: any) {
        return untrack(() => {
          const index = widgets.$.indexOf(widget)

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

export function mapAssetSelectorWidget(item: { id: string; data: { slug: string } }) {
  const { id, data } = item
  return { id, type: 'ASSET_SELECTOR' as const, data }
}

export function mapCustomWidget(item: any) {
  if (item?.type === 'ASSET_SELECTOR') {
    return mapAssetSelectorWidget(item)
  }
}
