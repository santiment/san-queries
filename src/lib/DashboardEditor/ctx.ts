import { getContext, setContext } from 'svelte'
import { writable } from 'svelte/store'
import { normalizeGrid, setItemOptions, sortLayout } from 'webkit/ui/SnapGrid/layout'

export const CTX = 'DashboardEditor$$'

export function DashboardEditor$$(defaultWidgets = [] as App.Dashboard.Widget[]) {
  const state = {
    widgets: defaultWidgets,
    layout: defaultWidgets.map((widget, i) => {
      const options = getGridItemOptions(widget)
      return setItemOptions([0, 1000 + i, 12, options.minRows], options)
    }) as SAN.SnapGrid.Item[],
  }

  normalizeGrid(sortLayout(state.layout))

  const store = writable(state)

  function updateLayout() {
    normalizeGrid(sortLayout(state.layout))
    state.layout = state.layout.slice()
    store.set(state)
  }

  return setContext(CTX, {
    dashboardEditor$: {
      ...store,
      updateLayout,
      addWidget(widget: App.Dashboard.Widget) {
        const options = getGridItemOptions(widget)
        const gridItem = setItemOptions([0, 1000, 12, options.minRows], options)

        state.layout.push(gridItem as SAN.SnapGrid.Item)
        state.widgets.push(widget)

        updateLayout()

        store.set(state)
      },
      removeWidget(widget: App.Dashboard.Widget) {
        const index = state.widgets.indexOf(widget)
        if (index < 0) return

        state.widgets.splice(index, 1)
        state.layout.splice(index, 1)

        updateLayout()

        store.set(state)
      },
    },
  })
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

export const getDashboardEditor$Ctx = () => getContext(CTX) as ReturnType<typeof DashboardEditor$$>

type DashboardEditorType = {
  widgets: App.Dashboard.Widget[]
}
type DashboardEditor$Type = ReturnType<typeof DashboardEditor$$>['dashboardEditor$']

declare global {
  namespace App {
    namespace Dashboard {
      type Controller = DashboardEditorType
      type ControllerStore = DashboardEditor$Type
    }
  }
}
