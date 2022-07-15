import { writable } from 'svelte/store'

export type Dashboard$ = ReturnType<typeof Dashboard>
export const Dashboard = (defaultValue?: null | SAN.Queries.Dashboard) => {
  const { subscribe, set } = writable(
    defaultValue || ({ panels: [] } as any as SAN.Queries.Dashboard),
  )

  const store = {
    subscribe,
    set,
  }

  return store
}
