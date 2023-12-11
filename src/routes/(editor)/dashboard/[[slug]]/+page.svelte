<script lang="ts">
  import type { PageData } from './$types'

  import { tick } from 'svelte'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { DashboardHead } from '$lib/EntityHead'
  import DashboardEditor from '$lib/DashboardEditor/index.svelte'
  import { DashboardEditor$$ } from './ctx'
  import { startDashboardSaveFlow } from './flow'
  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import {
    EventAutoSave$,
    EventDashboardChanged$,
    EventDashboardSaved$,
    EventSavingState$,
  } from '$routes/(editor)/query/events'
  import { mutateUpdateDashboard } from '$lib/api/dashboard/create'

  export let data: PageData

  const { currentUser$ } = getCurrentUser$Ctx()
  const { dashboardEditor$ } = DashboardEditor$$(data.apiDashboard)

  $: dashboardEditor = $dashboardEditor$
  $: ({ dashboard } = dashboardEditor)
  $: author = dashboard?.user || $currentUser$

  $: updateDashboard(data.apiDashboard)

  function updateDashboard(apiDashboard: (typeof data)['apiDashboard']) {
    if (dashboard?.id === apiDashboard?.id) return

    tick().then(() => dashboardEditor$.setApiDashboard(apiDashboard))
  }

  function saveDashboard(isForced = false) {
    EventSavingState$.dispatch({ state: 'start' })

    if (dashboardEditor.isLegacy) {
      console.log(dashboardEditor)
      return
    }

    startDashboardSaveFlow(dashboardEditor, isForced)
      .then((apiDashboard) => {
        console.log(apiDashboard)

        data.apiDashboard = apiDashboard
        dashboardEditor$.setApiDashboard(apiDashboard)

        EventDashboardSaved$.dispatch(apiDashboard)

        window.history.replaceState(
          '',
          history.state,
          '/dashboard/' + getSEOLinkFromIdAndTitle(apiDashboard.id, apiDashboard.name),
        )

        EventSavingState$.dispatch({ state: 'success' })
      })
      .catch(() => {
        EventSavingState$.dispatch({ state: 'hidden' })
      })
  }

  const saveShortcut = GlobalShortcut$('CMD+S', () => saveDashboard(true), false)
  $saveShortcut

  const eventDashboardChanged = EventDashboardChanged$(({ id, name, description }) => {
    if (name !== undefined) dashboardEditor.name = name
    if (description !== undefined) dashboardEditor.description = description

    dashboardEditor$.set(dashboardEditor)

    saveDashboard(!id)
  })
  $eventDashboardChanged

  const eventAutoSave = EventAutoSave$(() => dashboardEditor.name && saveDashboard())
  $eventAutoSave
</script>

<main class="column">
  <DashboardHead {dashboard} {author} />

  <DashboardEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
  }

  DashboardEditor {
    padding-top: 0 !important;
  }
</style>
