import { writable } from 'svelte/store'
import { PanelType } from '@/types'

function newPanel() {
  return {
    name: 'My table',
    settings: { type: PanelType.TABLE, columns: [] },
    sql: {
      query: 'SELECT * FROM intraday_metrics LIMIT 20',
      parameters: [],
    },
  } as any as SAN.Queries.DashboardPanel
}

function normalizePanel(panel: SAN.Queries.DashboardPanel): SAN.Queries.Panel {
  const { sql } = panel
  const { query, parameters } = sql

  const settings = Object.assign({ type: PanelType.TABLE, columns: [] }, panel.settings)

  return {
    ...panel,
    settings,
    sql: {
      query,
      parameters: Object.keys(parameters).map((key) => ({
        key,
        value: parameters[key],
      })),
    },
  }
}

function normalizeDashboard(dashboard?: null | SAN.Queries.Dashboard) {
  if (!dashboard) {
    return {
      panels: [normalizePanel(newPanel())],
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
