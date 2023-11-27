<script lang="ts">
  import type { Readable } from 'svelte/store'

  // import { page as page$ } from '$app/stores'
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { notifications$ } from 'webkit/ui/Notifications'
  import { getWorkspace$Ctx } from '$lib/LeftMenu/Work/ctx'
  import { TreeItemType } from '$lib/LeftMenu/Work/types'
  import Actions from './Actions.svelte'
  import ContentEditable from './ContentEditable.svelte'
  // import { DashboardEditor$$ } from './ctx'
  import Grid from './Grid.svelte'
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import { EventDashboardChanged$ } from '$routes/(editor)/query/events'

  let className = ''
  export { className as class }

  const { dashboardEditor$ } = getDashboardEditor$Ctx()
  // const { dashboardEditor$ } = DashboardEditor$$()
  // DashboardEditor$$()

  // $: if (process.browser) updateDashboard($page$)
  $: dashboardEditor = $dashboardEditor$

  type StoreValue<T> = T extends Readable<infer K> ? K : never

  function updateDashboard(page: StoreValue<typeof page$>) {
    if (!process.browser) return

    const data = page.url.searchParams.get('data')
    if (!data) {
      // dashboard = { title: '', description: '' }
      dashboardEditor$.update([], [])
      return
    }

    const value = JSON.parse(data)

    // dashboard = value
    dashboardEditor$.update(value.widgets, value.layout)
  }

  function onTitleChange(value: string) {
    const { name, dashboard } = dashboardEditor
    const { id } = dashboard || {}

    if (name === value) return
    // $dashboardEditor$.name = value

    // if (id) {
    EventDashboardChanged$.dispatch({ id, name: value })
    // }
  }

  function onDescriptionChange(value: string) {
    const { description, dashboard } = dashboardEditor
    const { id } = dashboard || {}

    if (description === value) return

    // if (id) {
    EventDashboardChanged$.dispatch({ id, description: value })
    // }

    // $dashboardEditor$.description = value
  }
</script>

<main class="column gap-m {className}">
  <header>
    <ContentEditable
      value={dashboardEditor.name}
      as="h1"
      class="h4 txt-m mrg-s mrg--b"
      placeholder="Add your title here..."
      onBlur={onTitleChange}
    />

    <ContentEditable
      value={dashboardEditor.description}
      class="body-2"
      placeholder="Add description here..."
      onBlur={onDescriptionChange}
    />
  </header>

  <Grid />

  <Actions />
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }
</style>
