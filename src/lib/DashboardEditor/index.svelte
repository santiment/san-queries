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
  import { queryGetCachedDashboardQueriesExecutions } from '$lib/api/dashboard/query'
  import Grid from './Grid.svelte'
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import { EventDashboardChanged$ } from '$routes/(editor)/query/events'
  import Legacy from './Legacy.svelte'
  import { BROWSER } from 'esm-env'
  import { showEditGlobalParameterDialog$ } from './EditGlobalParameterDialog.svelte'

  let className = ''
  export { className as class }

  const showEditGlobalParameterDialog = showEditGlobalParameterDialog$()
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

  function onAddGlobalParameterClick() {
    showEditGlobalParameterDialog()
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

  <parameters class="row gap-s mrg-l mrg--b">
    <button class="btn-2" on:click={onAddGlobalParameterClick}>Add global parameter</button>
  </parameters>

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
