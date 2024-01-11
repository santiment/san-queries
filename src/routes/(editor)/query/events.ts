import { BROWSER } from 'esm-env'
import { readable } from 'svelte/store'

function createEvent$<Data = undefined>(name: string, debounceTime?: number) {
  type Event = CustomEvent<Data>
  type Clb = Data extends undefined ? () => void : (data: Data) => void

  function CustomEvent$(clb: Clb) {
    return readable(null, () => {
      let debounceTimer: number

      const listener = (e: Event) => {
        if (debounceTime) {
          window.clearTimeout(debounceTimer)
          debounceTimer = window.setTimeout(() => clb(e.detail), debounceTime)
        } else {
          clb(e.detail)
        }
      }

      if (BROWSER) window.addEventListener<any>(name, listener)
      return () => BROWSER && window.removeEventListener<any>(name, listener)
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

export const EventRefreshUserCredits$ = createEvent$('REFRESH_USER_CREDITS')

export const EventAutoSave$ = createEvent$('AUTO_SAVE', 4000)
export const EventSavingState$ = createEvent$<{ state: 'start' | 'success' | 'error' | 'hidden' }>(
  'SAVING_STATE',
)

export const EventQueryDeleted$ = createEvent$<{ id: number }>('QUERY_DELETED')
export const EventDashboardDeleted$ = createEvent$<{ id: number }>('DASHBOARD_DELETED')

export const EventTableInsertSql$ = createEvent$<{ text: string }>('TABLE_INSERT_SQL')

export const EventDashboardUpdateQueries$ = createEvent$('DASHBOARD_UPDATE_QUERIES')
