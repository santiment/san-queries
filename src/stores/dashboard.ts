import { writable } from 'svelte/store'
import { PanelType, ParameterType } from '@/types'
import { Formatter } from '@/Result/Options/format'

function newPanel() {
  return {
    name: 'My table',
    settings: { type: PanelType.TABLE, columns: [] },
    sql: {
      query: 'SHOW TABLES',
      parameters: [],
    },
  } as any as SAN.Queries.DashboardPanel
}

function normalizeColumn({ title, formatterId }, id) {
  const column = { title, formatterId } as any

  const { fn } = Formatter[formatterId || 0]

  if (fn) {
    const accessor = (data) => data[id]
    column.format = (data) => fn(accessor(data))
    column.formatter = fn
  }

  return column
}

function normalizePanel(panel: SAN.Queries.DashboardPanel): SAN.Queries.Panel {
  const { sql } = panel
  const { query, parameters } = sql

  const settings: SAN.Queries.Panel['settings'] = Object.assign(
    { type: PanelType.TABLE, columns: [] },
    panel.settings,
  )
  settings.columns = settings.columns.map(normalizeColumn)

  return {
    ...panel,
    settings,
    sql: {
      query,
      parameters: Object.keys(parameters).map((key, i) => ({
        key,
        value: parameters[key],
        type: settings.parameters?.[i].type || ParameterType.Text,
      })),
    },
  }
}

function normalizeDashboard(dashboard?: null | SAN.Queries.Dashboard) {
  if (!dashboard) {
    return {
      panels: [normalizePanel(newPanel())],
      __normalized: true,
    }
  }

  const { panels, __normalized } = dashboard as any
  if (__normalized) return dashboard

  if (panels.length === 0) panels.push(newPanel())

  return {
    ...dashboard,
    panels: panels.slice(0, 1).map(normalizePanel),
    __normalized: true,
  }
}

export type Dashboard$ = ReturnType<typeof Dashboard>
export const Dashboard = (defaultValue?: null | SAN.Queries.Dashboard) => {
  const { subscribe, set } = writable(normalizeDashboard(defaultValue) as SAN.Queries.Dashboard)

  const store = {
    subscribe,
    set(dashboard: SAN.Queries.Dashboard) {
      // const { settings, panels } = dashboard

      /*
      if (!settings.sql) {
        settings.sql = ''
        settings.parameters = []
      }

      settings.columns = settings.columns || []

      dashboard.panels = dashboard.panels.slice(0, 1)


      if (!panels.length) {
        dashboard.panels.push(newPanel())
      }

      panels.forEach((panel) => {
        if (!panel.settings) panel.settings = {} as any
        panel.type = panel.settings.type || panel.type || PanelType.TABLE
      })
      */

      if (!dashboard.removedPanels) {
        dashboard.removedPanels = []
      }

      console.log(dashboard)

      /*
      if (!dashboard.sql) {
        if (dashboard.panels.length) {
          dashboard.sql = { ...dashboard.panels[0].sql }
        } else {
          dashboard.sql = { query: '', parameters: [] as any }
        }
      }
      */

      set(normalizeDashboard(dashboard) as any as SAN.Queries.Dashboard)
    },
  }

  return store
}
