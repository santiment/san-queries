<script>
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import QueryHead from '$lib/QueryHead/index.svelte'
  import QueryEditor from '$lib/QueryEditor/index.svelte'
  import { QueryEditor$$ } from './ctx'

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$()
</script>

<main class="column">
  <QueryHead author={$currentUser$} sql={$queryEditor$.sql} />

  <QueryEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
  }
</style>
