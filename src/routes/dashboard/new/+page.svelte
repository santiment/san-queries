<script>
  // import { getCurrentUser$Ctx } from 'webkit/stores/user'
  // import QueryHead from '$lib/QueryHead/index.svelte'
  import DashboardEditor from '$lib/DashboardEditor/index.svelte'

  // const { currentUser$ } = getCurrentUser$Ctx()
</script>

<main class="column">
  <DashboardEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
  }
</style>
