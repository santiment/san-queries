<script lang="ts">
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { getTimeFormats } from 'webkit/utils/dates'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { QueryHead } from '$lib/EntityHead'
  import QueryEditor, { TABS } from '$lib/QueryEditor/index.svelte'
  import { QueryEditor$$ } from './new/ctx'
  import { startSaveQueryFlow, startUpdateQueryEditorFlow } from './flow'
  import { showNameDescriptionDialog } from '$lib/QueryEditor/NameDescriptionDialog/index.svelte'
  import { EventQuerySave$ } from './events'

  export let apiQuery = null as null | App.ApiQuery
  export let defaultSql = ''

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(apiQuery, defaultSql)

  let QueryEditorNode: QueryEditor

  function onSave(queryEditor = $queryEditor$, isPublic?: boolean) {
    startSaveQueryFlow(queryEditor, isPublic).then((apiQuery) => {
      startUpdateQueryEditorFlow(queryEditor$, apiQuery)
    })
  }

  function onQueryExecute(promise: any) {
    promise
      .then(() => {
        QueryEditorNode.$set({ tab: TABS[1] })
      })
      .catch((error) => {
        const errors = Array.isArray(error) ? error : [error]

        errors.forEach((error) => {
          const { message, details = message } = error
          const { HH, mm, ss } = getTimeFormats(new Date())

          queryEditor$.addError({
            date: `${HH}:${mm}:${ss}`,
            details: details.replace('FORMAT JSONCompact', '').trim(),
          })
        })

        QueryEditorNode.$set({ tab: TABS[2] })
      })
  }

  function onQueryNameClick() {
    const queryEditor = $queryEditor$
    showNameDescriptionDialog({ queryEditor }).then((updated) => {
      onSave({ ...queryEditor, ...updated }, updated.isPublic)
    })
  }

  const saveShortcut = GlobalShortcut$(
    'CMD+S',
    () => {
      EventQuerySave$.dispatch()

      onSave()
    },
    false,
  )
  $saveShortcut
</script>

<main class="column">
  <QueryHead author={$currentUser$} {onQueryExecute} on:click={onQueryNameClick} />

  <slot />

  <QueryEditor bind:this={QueryEditorNode} />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
    min-width: 0;
    height: calc(100vh - 65px);
  }
</style>
