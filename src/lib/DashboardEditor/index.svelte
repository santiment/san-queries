<script lang="ts">
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { notifications$ } from 'webkit/ui/Notifications'
  import Actions from './Actions.svelte'
  import ContentEditable from './ContentEditable.svelte'
  import { DashboardEditor$$ } from './ctx'
  import Grid from './Grid.svelte'
  import { page as page$ } from '$app/stores'
  import type { Readable } from 'svelte/store'

  let className = ''
  export { className as class }

  const { dashboardEditor$ } = DashboardEditor$$()
  // DashboardEditor$$()

  let dashboard = {} as any

  $: if (process.browser) updateDashboard($page$)
  $: dashboardEditor = $dashboardEditor$

  let titleKey = 0
  if (process.browser) {
    // @ts-ignore
    window.updateDashboardEditor = (v: any) => {
      console.log(v)
      dashboard = v
      titleKey++
      dashboardEditor$.update(v.widgets, v.layout)
    }
  }

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
    titleKey++
    dashboardEditor$.update(value.widgets, value.layout)
  }

  function onTitleChange(value: string) {
    dashboard.title = value
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

        // @ts-ignore
        window.saveDashboard?.(dashboard)
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
    {#key titleKey}
      <ContentEditable
        value={dashboard.title}
        as="h1"
        class="h4 txt-m mrg-s mrg--b"
        placeholder="Add your title here..."
        onChange={onTitleChange}
      />
    {/key}

    <ContentEditable
      value={dashboard.description}
      class="body-2"
      placeholder="Add description here..."
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
