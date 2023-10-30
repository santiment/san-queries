<script>
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import QueryHead from '$lib/QueryHead/index.svelte'
  import DashboardEditor from '$lib/DashboardEditor/index.svelte'

  // const { currentUser$ } = getCurrentUser$Ctx()

  const { currentUser$ } = getCurrentUser$Ctx()
</script>

<main class="column">
  <QueryHead author={$currentUser$} sql={''} />

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
