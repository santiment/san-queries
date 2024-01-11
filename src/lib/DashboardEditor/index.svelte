<script lang="ts">
  import type { Readable } from 'svelte/store'

  import { BROWSER } from 'esm-env'
  // import { page as page$ } from '$app/stores'
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { notifications$ } from 'webkit/ui/Notifications'
  import { getWorkspace$Ctx } from '$lib/LeftMenu/Work/ctx'
  import { TreeItemType } from '$lib/LeftMenu/Work/types'
  import Actions from './Actions.svelte'
  import ContentEditable from './ContentEditable.svelte'
  // import { DashboardEditor$$ } from './ctx'
  import { queryGetCachedDashboardQueriesExecutions } from '$lib/api/dashboard/query'
  import Grid from './Grid.svelte'
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import { EventDashboardChanged$ } from '$routes/(editor)/query/events'
  import Legacy from './Legacy.svelte'
  import Globals from './Globals/Parameters.svelte'

  let className = ''
  export { className as class }

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  let CachedData = {} as any

  $: dashboardEditor = $dashboardEditor$
  $: id = dashboardEditor.dashboard?.id

  $: if (BROWSER && id) getQueriesCache(id)

  function getQueriesCache(dashboardId: number) {
    queryGetCachedDashboardQueriesExecutions(dashboardId).then((cached) => {
      const result = {} as any

      cached.forEach((query) => {
        result[query.dashboardQueryMappingId] = query
      })

      CachedData = result
      console.log(CachedData)
    })
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

  <Globals />

  {#if dashboardEditor.isLegacy && dashboardEditor.dashboard}
    {#if BROWSER}
      <Legacy dashboard={dashboardEditor.dashboard} />
    {/if}
  {:else}
    <Grid {CachedData} />

    <Actions />
  {/if}
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }
</style>
