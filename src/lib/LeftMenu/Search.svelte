<script context="module" lang="ts">
  const CTX = 'Search$$'
  export function Search$$() {
    const store = writable('')

    const getRegExp = (searchInput: string) =>
      new RegExp(searchInput.replace(/[\W_]+/g, '(.*)'), 'i')

    return setContext(CTX, {
      search$: {
        ...store,
        apply<T>(
          searchInput: string,
          data: T[],
          filter: (searchInput: RegExp, item: T) => boolean,
        ) {
          if (!searchInput) return data

          const regex = getRegExp(searchInput)
          return data.filter((item) => filter(regex, item))
        },

        modify<T>(searchInput: string, data: T, modify: (searchInput: RegExp, data: T) => T) {
          if (!searchInput) return data

          return modify(getRegExp(searchInput), data)
        },
      },
    })
  }
  export const getSearch$Ctx = () => getContext(CTX) as ReturnType<typeof Search$$>
</script>

<script lang="ts">
  import type { TABS } from './tabs'

  import { getContext, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import Search from 'webkit/ui/Search.svelte'
  import { debounce$$ } from 'webkit/utils/fn'
  import { track } from 'webkit/analytics'

  export let tab: (typeof TABS)[number]

  const { search$ } = getSearch$Ctx()

  const onSearch$ = debounce$$(250, (input: string) => {
    const value = input.trim()
    search$.set(value)

    track.event('left_menu_search', {
      category: 'Interaction',
      input: value,
      tab: tab.title,
    })
  })

  const onInput = ({ currentTarget }: Event) =>
    $onSearch$((currentTarget as HTMLInputElement).value)
</script>

<Search class="search" placeholder={tab.search.placeholder} on:input={onInput} />

<style lang="scss">
  Search {
    margin: 0;

    &,
    :global(input) {
      background: none;
    }
  }
</style>
