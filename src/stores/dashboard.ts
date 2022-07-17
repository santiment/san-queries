import { writable } from 'svelte/store'

export type Dashboard$ = ReturnType<typeof Dashboard>
export const Dashboard = (defaultValue?: null | SAN.Queries.Dashboard) => {
  const { subscribe, set } = writable(
    defaultValue ||
      ({
        sql: { query: 'SELECT * FROM intraday_metrics LIMIT 20', parameters: [] },
        panels: [],
      } as any as SAN.Queries.Dashboard),
  )

  const store = {
    subscribe,
    set(dashboard: SAN.Queries.Dashboard) {
      if (!dashboard.sql && dashboard.panels.length) {
        dashboard.sql = { ...dashboard.panels[0].sql }
      } else {
        dashboard.sql = { query: '', parameters: [] }
      }

      set(dashboard)
    },
  }

  return store
}
