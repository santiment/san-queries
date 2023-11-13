<script lang="ts">
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { notifications$ } from 'webkit/ui/Notifications'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { QueryHead } from '$lib/EntityHead'
  import QueryEditor from '$lib/QueryEditor/index.svelte'
  import { QueryEditor$$ } from './new/ctx'
  import { startSaveQueryFlow } from './flow'

  export let apiQuery = null as null | App.ApiQuery
  export let defaultSql = ''

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(apiQuery, defaultSql)

  $: console.log($queryEditor$)

  const saveShortcut = GlobalShortcut$(
    'CMD+S',
    () => {
      startSaveQueryFlow(queryEditor$).then((apiQuery) => {
        window.history.replaceState('', history.state, '/query/' + apiQuery.id)
      })
    },
    false,
  )
  $saveShortcut
</script>

<main class="column">
  <QueryHead author={$currentUser$} />

  <slot />

  <QueryEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
    min-width: 0;
  }
</style>
