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
  import { getDashboardEditor$Ctx } from '$routes/dashboard/[[slug]]/ctx'

  let className = ''
  export { className as class }

  const { dashboardEditor$ } = getDashboardEditor$Ctx()
  // const { dashboardEditor$ } = DashboardEditor$$()
  // DashboardEditor$$()

  let dashboard = { title: '', description: '' } as any

  // $: if (process.browser) updateDashboard($page$)
  $: dashboardEditor = $dashboardEditor$

  type StoreValue<T> = T extends Readable<infer K> ? K : never

  function updateDashboard(page: StoreValue<typeof page$>) {
    if (!process.browser) return

    const data = page.url.searchParams.get('data')
    if (!data) {
      dashboard = { title: '', description: '' }
      dashboardEditor$.update([], [])
      return
    }

    const value = JSON.parse(data)

    dashboard = value
    dashboardEditor$.update(value.widgets, value.layout)
  }

  function onTitleChange(value: string) {
    $dashboardEditor$.name = value
  }

  function onDescriptionChange(value: string) {
    $dashboardEditor$.description = value
  }

  const saveShortcut = GlobalShortcut$(
    'CMD+S',
    () => {
      if (dashboard.title) {
        notifications$.show({
          type: 'success',
          title: 'Dashboard saved',
          description: 'Dashboard is available in "Work" tab',
          dismissAfter: 4000,
        })

        dashboard = { ...dashboard, ...dashboardEditor }
      } else {
        notifications$.show({
          type: 'error',
          title: "Can't save untitled dashboard",
          description: 'Please add a title to save a dashboard',
          dismissAfter: 4000,
        })
      }
    },
    false,
  )
  $saveShortcut
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

  <!-- <Grid /> -->

  <Actions />
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }
</style>
