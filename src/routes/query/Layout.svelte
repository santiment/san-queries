<script lang="ts">
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { getSEOLinkFromIdAndTitle } from 'webkit/utils/url'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { QueryHead } from '$lib/EntityHead'
  import QueryEditor, { TABS } from '$lib/QueryEditor/index.svelte'
  import { QueryEditor$$ } from './new/ctx'
  import { startSaveQueryFlow } from './flow'

  export let apiQuery = null as null | App.ApiQuery
  export let defaultSql = ''

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(apiQuery, defaultSql)

  let QueryEditorNode: QueryEditor

  function onSave() {
    startSaveQueryFlow(queryEditor$).then((apiQuery) => {
      window.history.replaceState(
        '',
        history.state,
        '/query/' + getSEOLinkFromIdAndTitle(apiQuery.id, apiQuery.name),
      )
    })
  }

  function onQueryExecute() {
    QueryEditorNode.$set({ tab: TABS[1] })
  }

  const saveShortcut = GlobalShortcut$('CMD+S', onSave)
  $saveShortcut
</script>

<main class="column">
  <QueryHead author={$currentUser$} {onQueryExecute} />

  <slot />

  <QueryEditor bind:this={QueryEditorNode} onEditorSave={onSave} />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
    min-width: 0;
    height: calc(100vh - 65px);
  }
</style>
