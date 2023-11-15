import type { SnapItem } from 'san-webkit/lib/ui/SnapGrid/types'

import { normalizeGrid, setItemOptions, sortLayout } from 'san-webkit/lib/ui/SnapGrid/layout'
import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'

export const CTX = 'DashboardEditor$$'

type Store = {
  dashboard?: null | App.ApiDashboard

  name: string
  description: string

  widgets: App.Dashboard.Widget[]
  layout: SnapItem[]
}

function prepareStore(apiDashboard?: null | App.ApiDashboard) {
  const { name = '', description = '', textWidgets = [] } = apiDashboard || {}

  let { layout = [] } = apiDashboard?.settings || {}
  let widgets = []

  function mapTextWidget({ id, body }) {
    return { id, type: 'TEXT', value: body }
  }

  if (layout.length === 0) {
    widgets = textWidgets.map(mapTextWidget)
    layout = widgets.map((widget, i) => {
      const options = getGridItemOptions(widget)
      return setItemOptions([0, 1000 + i, 12, options.minRows], options)
    })
  } else {
    const IdToWidget = textWidgets.reduce((acc, v) => {
      acc[v.id] = v
      return acc
    }, {} as Record<string, any>)

    layout = layout
      .map(({ id, xywh }) => {
        const widget = IdToWidget[id]
        if (widget) {
          widgets.push(mapTextWidget(widget))
          return xywh.slice(0, 4)
        }
      })
      .filter(Boolean)
  }

  normalizeGrid(sortLayout(layout))

  return {
    dashboard: apiDashboard,

    name,
    description,

    widgets,
    layout,
  }
}

export function DashboardEditor$$(apiDashboard?: null | App.ApiDashboard) {
  let state = prepareStore(apiDashboard)
  const dashboardEditor$ = writable(state)

  return setContext(CTX, {
    dashboardEditor$: {
      ...dashboardEditor$,

      setApiDashboard(apiDashboard?: null | App.ApiDashboard) {
        state = prepareStore(apiDashboard)
        dashboardEditor$.set(state)
      },

      updateLayout(forceUpdate = true) {
        normalizeGrid(sortLayout(state.layout))

        if (forceUpdate) {
          dashboardEditor$.set(state)
        }
      },

      addWidget(widget: App.Dashboard.Widget) {
        const options = getGridItemOptions(widget)
        const gridItem = setItemOptions([0, 1000, 12, options.minRows], options)

        state.layout.push(gridItem as SAN.SnapGrid.Item)
        state.widgets.push(widget)

        this.updateLayout()
      },

      removeWidget(widget: App.Dashboard.Widget) {
        const index = state.widgets.indexOf(widget)
        if (index < 0) return

        state.widgets.splice(index, 1)
        state.layout.splice(index, 1)

        this.updateLayout()
      },
    },
  })
}

export const getDashboardEditor$Ctx = () => getContext(CTX) as ReturnType<typeof DashboardEditor$$>

declare global {
  namespace App {
    type DashboardEditorStore = ReturnType<typeof DashboardEditor$$>['dashboardEditor$']
    type DashboardEditorStoreValue = Store
  }
}

function getGridItemOptions(widget: App.Dashboard.Widget) {
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

    default:
      return {
        minRows: 8,
        minCols: 4,
      }
  }
}
