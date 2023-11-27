<script lang="ts">
  import type { PageData } from './$types'

  import { tick } from 'svelte'
  import { queryGetSqlQuery } from '$lib/api/query/get'
  import { mutateUpdateSqlQuery } from '$lib/api/query/update'
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { getTimeFormats } from 'webkit/utils/dates'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { QueryHead } from '$lib/EntityHead'
  import QueryEditor, { TABS } from '$lib/QueryEditor/index.svelte'
  import { showNameDescriptionDialog } from '$lib/QueryEditor/NameDescriptionDialog/index.svelte'
  import { QueryEditor$$ } from '../ctx'
  import { startSaveQueryFlow, startUpdateQueryEditorFlow } from '../flow'
  import { EventQuerySave$, EventQueryChanged$, EventQuerySaved$ } from '../events'

  export let data: PageData

  let apiQuery = data.apiQuery as null | App.ApiQuery
  let defaultSql = ''

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(apiQuery, defaultSql)

  let QueryEditorNode: QueryEditor

  $: updateQuery(apiQuery)

  function updateQuery(apiQuery: any) {
    const query = $queryEditor$.query
    if (query?.id === apiQuery?.id) return

    tick().then(() => queryEditor$.setApiQuery(apiQuery))
  }

  function onSave(queryEditor = $queryEditor$, isPublic?: boolean) {
    startSaveQueryFlow(queryEditor, isPublic).then((apiQuery) => {
      startUpdateQueryEditorFlow(queryEditor$, apiQuery)

      queryGetSqlQuery(apiQuery.id).then((data) => Object.assign(data, apiQuery))

      EventQuerySaved$.dispatch(apiQuery)
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
      const { id } = queryEditor.query || {}

      queryEditor.name = updated.name
      queryEditor.description = updated.description

      queryEditor$.set(queryEditor)

      if (id) {
        EventQueryChanged$.dispatch({ ...updated, id })
      }
      // onSave({ ...queryEditor, ...updated }, updated.isPublic)
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

  const eventQueryChanged = EventQueryChanged$((variables) => {
    mutateUpdateSqlQuery(variables)
  })
  $eventQueryChanged
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
