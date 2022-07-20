import { writable } from 'svelte/store'
import { PanelType } from '@/types'

export type Dashboard$ = ReturnType<typeof Dashboard>
export const Dashboard = (defaultValue?: null | SAN.Queries.Dashboard) => {
  const { subscribe, set } = writable(
    defaultValue ||
      ({
        settings: {
          sql: 'SELECT * FROM intraday_metrics LIMIT 20',
          parameters: [],
          columns: [],
        },
        panels: [],
      } as any as SAN.Queries.Dashboard),
  )

  const store = {
    subscribe,
    set(dashboard: SAN.Queries.Dashboard) {
      const { settings, panels } = dashboard

      if (!settings.sql) {
        settings.sql = ''
        settings.parameters = []
      }

      settings.columns = settings.columns || []

      panels.forEach((panel) => {
        if (!panel.settings) panel.settings = {} as any
        panel.type = panel.settings.type || panel.type || PanelType.TABLE
      })

      /*
      if (!dashboard.sql) {
        if (dashboard.panels.length) {
          dashboard.sql = { ...dashboard.panels[0].sql }
        } else {
          dashboard.sql = { query: '', parameters: [] as any }
        }
      }
      */

      set(dashboard)
    },
  }

  return store
}
