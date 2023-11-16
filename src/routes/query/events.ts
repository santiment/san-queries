import { readable } from 'svelte/store'

const QUERY_SAVE = 'QUERY_SAVE'

function createEvent$<Data = undefined>(name: string) {
  type Event = CustomEvent<Data>
  type Clb = Data extends undefined ? () => void : (data: Data) => void

  function Test(clb: Clb) {
    return readable(null, () => {
      const listener = ({ detail }: Event) => clb(detail)

      if (process.browser) window.addEventListener<any>(name, listener)
      return () => process.browser && window.removeEventListener<any>(name, listener)
    })
  }

  Test.dispatch = ((detail: Data) =>
    window.dispatchEvent(new CustomEvent(name, { detail }))) as Data extends undefined
    ? () => boolean
    : (detail: Data) => boolean

  return Test
}

export const EventQuerySave$ = createEvent$(QUERY_SAVE)
