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

  parameters: {
    global: true
    key: string
    value: number | string
    type: 'Text' | 'Number'
    overrides: { dashboard_query_mapping_id: string; parameter: string }[]
  }[]
}

function prepareStore(apiDashboard?: null | App.ApiDashboard) {
  const {
    name = '',
    description = '',
    textWidgets = [],
    queries = [],
    parameters = {},
  } = apiDashboard || {}

  let { layout = [] } = apiDashboard?.settings || {}
  let widgets = []

  function mapTextWidget({ id, body }) {
    return { id, type: 'TEXT', value: body }
  }

  function mapQueryWidget(query: App.ApiQuery) {
    return { id: query.dashboardQueryMappingId, type: 'QUERY', title: query.name, query }
  }

  console.log({ layout, queries })

  if (layout.length === 0) {
    widgets = textWidgets.map(mapTextWidget)
    widgets = widgets.concat(queries.map(mapQueryWidget))

    layout = widgets.map((widget, i) => {
      const options = getGridItemOptions(widget)
      return setItemOptions([0, 1000 + i, 12, options.minRows], options)
    })
  } else {
    const IdToWidget = textWidgets.reduce((acc, v) => {
      acc[v.id] = mapTextWidget(v)
      return acc
    }, {} as Record<string, any>)

    queries.forEach((query) => {
      IdToWidget[query.dashboardQueryMappingId] = mapQueryWidget(query)
    })

    layout = layout
      .map(({ id, xywh }) => {
        const widget = IdToWidget[id]
        if (widget) {
          delete IdToWidget[id]

          if ('body' in widget) widgets.push(widget)
          else widgets.push(widget)

          return xywh.slice(0, 4)
        }
      })
      .filter(Boolean)

    Object.values(IdToWidget).forEach((widget) => {
      widgets.push(widget)

      const options = getGridItemOptions(widget)
      const gridItem = setItemOptions([0, 1000, 12, options.minRows], options)
      layout.push(gridItem)
    })
  }

  normalizeGrid(sortLayout(layout))

  const dashboardParameters = Object.keys(parameters).map((key) => {
    const { overrides, ...rest } = parameters[key]
    return {
      ...rest,
      key,
      type: 'Text',
      global: true,
      overrides: overrides.reduce((acc, value) => {
        let query = acc[value.dashboard_query_mapping_id]
        if (!query) query = acc[value.dashboard_query_mapping_id] = {}

        query[value.parameter] = true

        return acc
      }, {}),
    }
  })

  return {
    dashboard: apiDashboard,

    name,
    description,

    widgets,
    layout,

    parameters: dashboardParameters,
    isLegacy: apiDashboard?.isLegacy || false,
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
        widget.scrolOnMount = true

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

      addParameter(parameter: any) {
        state.parameters.push({ ...parameter, global: true })

        dashboardEditor$.set(state)
      },

      removeParameter(parameter: any, i?: number) {
        const index = i ?? state.parameters.indexOf(parameter)
        if (index < 0) return

        state.parameters.splice(index, 1)

        dashboardEditor$.set(state)
      },

      updateParameter(parameter: any, newParameter: any) {
        Object.assign(parameter, newParameter)

        dashboardEditor$.set(state)
      },

      unlinkGlobalParameter(parameter: any, globalParameter: any) {
        dashboardEditor$.set(state)
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
