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
  import {
    EventQuerySave$,
    EventQueryChanged$,
    EventQuerySaved$,
    EventSavingState$,
    EventAutoSave$,
  } from '../events'
  import { saveEditorState } from '$lib/SQLEditor/utils'

  export let data: PageData

  let defaultSql = ''

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(data.apiQuery, defaultSql)

  let QueryEditorNode: QueryEditor

  $: ({ apiQuery } = data)
  $: updateQuery(apiQuery)

  function updateQuery(apiQuery: any) {
    const query = $queryEditor$.query
    if (query?.id === apiQuery?.id) return

    tick().then(() => queryEditor$.setApiQuery(apiQuery))
  }

  function onSave(queryEditor = $queryEditor$, isPublic?: boolean, isForced = false) {
    const isNew = !queryEditor.query

    EventSavingState$.dispatch({ state: 'start' })

    startSaveQueryFlow(queryEditor, isPublic, isForced)
      .then((apiQuery) => {
        if (isNew) {
          const editor = QueryEditorNode?.getEditor()
          saveEditorState(editor, apiQuery.id)
        }

        startUpdateQueryEditorFlow(queryEditor$, apiQuery)

        queryGetSqlQuery(apiQuery.id).then((data) => Object.assign(data, apiQuery))

        EventQuerySaved$.dispatch(apiQuery)
        EventSavingState$.dispatch({ state: 'success' })
      })
      .catch(() => {
        EventSavingState$.dispatch({ state: 'hidden' })
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
      .finally(() => {
        quickSave()
      })
  }

  function onQueryNameClick() {
    const queryEditor = $queryEditor$
    showNameDescriptionDialog({ queryEditor }).then((updated) => {
      // const { id } = queryEditor.query || {}

      queryEditor.name = updated.name
      queryEditor.description = updated.description

      queryEditor$.set(queryEditor)

      quickSave(false, updated.isPublic)
      // if (id) {
      // EventQueryChanged$.dispatch({ ...updated, id })
      // }
      // onSave({ ...queryEditor, ...updated }, updated.isPublic)
    })
  }

  function quickSave(isForced = false, isPublic = undefined) {
    EventQuerySave$.dispatch()

    onSave(undefined, isPublic, isForced)
  }

  const saveShortcut = GlobalShortcut$('CMD+S', () => quickSave(true), false)
  $saveShortcut

  const eventQueryChanged = EventQueryChanged$((variables) => {
    mutateUpdateSqlQuery(variables)
  })
  $eventQueryChanged
</script>

<main class="column relative">
  <QueryHead author={$currentUser$} {onQueryExecute} {quickSave} on:click={onQueryNameClick} />

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
