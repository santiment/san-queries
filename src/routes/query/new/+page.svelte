<script>
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import QueryHead from '$lib/QueryHead/index.svelte'
  import QueryEditor from '$lib/QueryEditor/index.svelte'

  const { currentUser$ } = getCurrentUser$Ctx()
</script>

<main class="column">
  <QueryHead author={$currentUser$} />

  <QueryEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
  }
</style>
