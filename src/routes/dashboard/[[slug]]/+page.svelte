<script lang="ts">
  import type { PageData } from './$types'

  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { DashboardHead } from '$lib/EntityHead'
  import DashboardEditor from '$lib/DashboardEditor/index.svelte'
  import { DashboardEditor$$ } from './ctx'

  export let data: PageData

  const { currentUser$ } = getCurrentUser$Ctx()
  const { dashboardEditor$ } = DashboardEditor$$(data.apiDashboard)

  $: dashboardEditor = $dashboardEditor$
  $: author = dashboardEditor.dashboard?.user || $currentUser$

  $: console.log(data, dashboardEditor)
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
