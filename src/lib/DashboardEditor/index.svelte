<script lang="ts">
  import { onDestroy } from 'svelte'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import Actions from './Actions.svelte'
  import ContentEditable from './ContentEditable.svelte'
  import { DashboardEditor$$ } from './ctx'
  import Grid from './Grid.svelte'
  import { notifications$ } from 'san-webkit/lib/ui/Notifications'

  let className = ''
  export { className as class }

  const { dashboardEditor$ } = DashboardEditor$$()
  // DashboardEditor$$()

  let dashboard = {} as any
  let title = ''
  let description = ''

  let unsubSaveShortcut: any

  $: dashboardEditor = $dashboardEditor$

  let titleKey = 0
  if (process.browser) {
    unsubSaveShortcut = newGlobalShortcut(
      'CMD+S',
      () => {
        if (title) {
          notifications$.show({
            type: 'success',
            title: 'Dashboard saved',
            description: 'Dashboard is available in "Work" tab',
            dismissAfter: 4000,
          })

          dashboard = { ...dashboard, title, description, ...dashboardEditor }

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

    // @ts-ignore
    window.updateDashboardEditor = (v: any) => {
      console.log(v)
      dashboard = v
      title = v.title
      titleKey++
      description = v.description
      dashboardEditor$.update(v.widgets, v.layout)
    }
  }

  function onTitleChange(value: string) {
    title = value
  }

  onDestroy(() => {
    if (process.browser) {
      unsubSaveShortcut()
    }
  })
</script>

<main class="column gap-m {className}">
  <header>
    {#key titleKey}
      <ContentEditable
        value={title}
        as="h1"
        class="h4 txt-m mrg-s mrg--b"
        placeholder="Add your title here..."
        onChange={onTitleChange}
      />
    {/key}

    <ContentEditable value={description} class="body-2" placeholder="Add description here..." />
  </header>

  <Grid />

  <Actions />
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }
</style>
