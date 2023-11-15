<script lang="ts">
  import type { PageData } from './$types'

  import { tick } from 'svelte'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { DashboardHead } from '$lib/EntityHead'
  import DashboardEditor from '$lib/DashboardEditor/index.svelte'
  import { DashboardEditor$$ } from './ctx'
  import { startDashboardSaveFlow } from './flow'

  export let data: PageData

  const { currentUser$ } = getCurrentUser$Ctx()
  const { dashboardEditor$ } = DashboardEditor$$(data.apiDashboard)

  $: dashboardEditor = $dashboardEditor$
  $: ({ dashboard } = dashboardEditor)
  $: author = dashboard?.user || $currentUser$

  $: console.log(data, dashboardEditor)

  $: if (dashboard?.id !== data.apiDashboard?.id) updateDashboard(data.apiDashboard)

  function updateDashboard(apiDashboard: (typeof data)['apiDashboard']) {
    tick().then(() => dashboardEditor$.setApiDashboard(apiDashboard))
  }

  const saveShortcut = GlobalShortcut$(
    'CMD+S',
    () => {
      startDashboardSaveFlow(dashboardEditor).then((apiDashboard) => {
        dashboardEditor$.setApiDashboard(apiDashboard)
      })
    },
    false,
  )
  $saveShortcut
</script>

<main class="column">
  <DashboardHead {author} />

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
