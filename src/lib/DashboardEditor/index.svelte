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

  // const { dashboardEditor$ } = DashboardEditor$$()
  DashboardEditor$$()

  let title = ''
  let description = ''

  let unsubSaveShortcut: any

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
    <ContentEditable
      as="h1"
      class="h4 txt-m mrg-s mrg--b"
      placeholder="Add your title here..."
      onChange={onTitleChange}
    >
      {title}
    </ContentEditable>

    <ContentEditable class="body-2" placeholder="Add description here...">
      {description}
    </ContentEditable>
  </header>

  <Grid />

  <Actions />
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }
</style>
