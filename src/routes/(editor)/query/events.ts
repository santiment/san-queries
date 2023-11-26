import { readable } from 'svelte/store'

function createEvent$<Data = undefined>(name: string) {
  type Event = CustomEvent<Data>
  type Clb = Data extends undefined ? () => void : (data: Data) => void

  function CustomEvent$(clb: Clb) {
    return readable(null, () => {
      const listener = (e: Event) => {
        console.log(e)
        clb(e.detail)
      }

      if (process.browser) window.addEventListener<any>(name, listener)
      return () => process.browser && window.removeEventListener<any>(name, listener)
    })
  }

  CustomEvent$.dispatch = ((detail: Data) =>
    window.dispatchEvent(new CustomEvent(name, { detail }))) as Data extends undefined
    ? () => boolean
    : (detail: Data) => boolean

  return CustomEvent$
}

export const EventQuerySave$ = createEvent$('QUERY_SAVE')

export const EventQuerySaved$ = createEvent$<{ id: number; name: string }>('QUERY_SAVED')

export const EventQueryExecute$ = createEvent$('QUERY_EXECUTE')

export const EventQueryChanged$ = createEvent$<{
  id: number
  name: string
  description: string
  isPublic: boolean
}>('QUERY_CHANGED')

export const EventDashboardChanged$ = createEvent$<{
  id: number
  name?: string
  description?: string
}>('DASHBOARD_CHANGED')

export const EventDashboardSaved$ = createEvent$<{ id: number; name: string }>('DASHBOARD_SAVED')
