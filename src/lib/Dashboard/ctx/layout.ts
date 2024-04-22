import type { TDashboardSettings } from './schema'

import { ss } from 'svelte-runes'
import { normalizeGrid, setItemOptions, sortLayout } from 'san-webkit/lib/ui/SnapGrid/layout'
import { createCtx } from '$lib/ctx'

export function parseLayout(
  widgets: { id: string; type: string }[],
  apiLayout: TDashboardSettings['layout'],
) {
  const LayoutByWidgetId = apiLayout.reduce(
    (acc, item) => {
      acc[item.id] = item.xywh.slice(0, 4) as (typeof item)['xywh']
      return acc
    },
    {} as Record<(typeof apiLayout)[number]['id'], (typeof apiLayout)[number]['xywh']>,
  )

  const layout = widgets.map((widget, i) => {
    const options = getGridItemOptions(widget)
    const widgetLayout = LayoutByWidgetId[widget.id] || [
      0,
      1000 + i,
      options.maxCols || 12,
      options.minRows,
    ]
    return setItemOptions(widgetLayout, options)
  })

  normalizeGrid(sortLayout(layout))

  return layout
}

export const useDashboardLayoutCtx = createCtx(
  'useDashboardLayoutCtx',
  (widgets: { id: string; type: string }[] = [], apiLayout: TDashboardSettings['layout'] = []) => {
    const layout = ss(parseLayout(widgets, apiLayout))

    function update() {
      normalizeGrid(sortLayout(layout.$ as any))
      layout.$ = layout.$
    }

    return {
      layout,
      removeItem(index: number) {
        if (index < 0) return

        layout.$.splice(index, 1)
        update()
      },
      addItem(widget: any) {
        // TODO: call in widgets ctx addWidget
        if (!widget) return

        widget.scrolOnMount = true

        const options = getGridItemOptions(widget)
        const gridItem = setItemOptions([0, 1000, options.maxCols ?? 12, options.minRows], options)

        layout.$.push(gridItem as any)
        update()
      },
    }
  },
)

export function getGridItemOptions(widget: { type: string }) {
  switch (widget.type) {
    case 'TEXT':
    case 'HEADING':
      return {
        minRows: 2,
      }
    case 'IMAGE':
      return {
        minRows: 4,
        minCols: 3,
      }

    case 'ASSET_SELECTOR':
      return {
        minRows: 2,
        minCols: 2,
        maxCols: 3,
      }

    default:
      return {
        minRows: 8,
        minCols: 4,
      }
  }
}

export function shareLayout(widgets: { id: string }[], layout: ReturnType<typeof parseLayout>) {
  return widgets.map((widget, i) => {
    return { id: widget.id, xywh: layout[i].slice(0, 4) as [number, number, number, number] }
  })
}
