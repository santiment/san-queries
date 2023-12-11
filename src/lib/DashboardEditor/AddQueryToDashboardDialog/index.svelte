<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './index.svelte'

  export const showAddQueryToDashboardDialog = (props: { onQueryAdd: (query: any) => void }) =>
    dialogs.__show(Component, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Tabs from 'webkit/ui/Tabs'
  import Svg from 'webkit/ui/Svg/svelte'
  import Search from 'webkit/ui/Search.svelte'
  import { queryGetUserQueries, queryGetPublicQueries } from '$lib/api/query/get'
  import Queries from './Queries.svelte'
  import { debounce$$ } from 'san-webkit/lib/utils/fn'
  import { Search$$ } from '$lib/LeftMenu/Search.svelte'

  export let onQueryAdd: (query: App.Dashboard.Query) => void

  const { search$ } = Search$$()
  const tabs = [
    { title: 'My queries', icon: 'chart' },
    { title: 'Queries from the community', icon: 'user' },
  ] as const

  let queries = [] as Awaited<ReturnType<typeof queryGetUserQueries>>

  const setter = (data: typeof queries) => (queries = data)

  queryGetUserQueries(true).then(setter)

  $: filteredQueries = search$.apply($search$, queries, filterQueries)

  function filterQueries(input: RegExp, query: (typeof queries)[number]) {
    return query.name.search(input) >= 0
  }

  function onTabSelect(item: (typeof tabs)[number]) {
    if (item.title === 'My queries') {
      queryGetUserQueries().then(setter)
    } else {
      queryGetPublicQueries().then(setter)
    }
  }

  const onSearch$ = debounce$$(250, (value: string) => search$.set(value.trim()))
  const onInput = ({ currentTarget }: Event) =>
    $onSearch$((currentTarget as HTMLInputElement).value)
</script>

<Dialog {...$$props} title="Add queries to this dashboard">
  <div class="dialog-body">
    <Tabs class="gap-s" {tabs} let:item border onSelect={onTabSelect}>
      <Svg id={item.icon} w="12" />
      {item.title}
    </Tabs>

    <Search class="mrg-xl mrg--t mrg--b" big placeholder="Search for a query" on:input={onInput} />

    <Queries queries={filteredQueries} {onQueryAdd} />
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 960px;
  }

  .dialog-body {
    padding: 24px 32px;
  }

  Tabs {
    --tab-padding: 6px 8px;
  }
</style>
