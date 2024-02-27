<script lang="ts">
  import type { PageData } from './$types'

  import { onMount, setContext, tick } from 'svelte'
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
  import { page } from '$app/stores'
  import { BROWSER } from 'esm-env'

  export let data: PageData

  let defaultSql = ''

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(data.apiQuery, defaultSql)

  let QueryEditorNode: QueryEditor

  $: currentUser = $currentUser$
  $: ({ apiQuery } = data)
  $: updateQuery(apiQuery)
  $: author = apiQuery?.user || currentUser
  $: isAuthor = currentUser?.id === author?.id

  function updateQuery(apiQuery: any) {
    const query = $queryEditor$.query
    if (query?.id === apiQuery?.id) return

    tick().then(() => queryEditor$.setApiQuery(apiQuery))
  }

  function onSave(queryEditor = $queryEditor$, isPublic?: boolean, isForced = false) {
    if (!isAuthor) return

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
    if (!isAuthor) return

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
  setContext('quickSave', quickSave)

  const saveShortcut = GlobalShortcut$('CMD+S', () => quickSave(true), false)
  $saveShortcut

  const eventQueryChanged = EventQueryChanged$((variables) => {
    mutateUpdateSqlQuery(variables)
  })
  $eventQueryChanged

  const eventAutoSave = EventAutoSave$(() => $queryEditor$.name && quickSave())
  $eventAutoSave

  $: if (BROWSER) parseSharedData($page)

  function parseSharedData(page: any) {
    const sharedData = page.url.searchParams.get('data')

    if (!sharedData) return

    try {
      const data = JSON.parse(sharedData)

      queryEditor$.setApiQuery({
        name: data.name,
        sqlQueryText: data.sql,
        sqlQueryParameters: data.parameters,
      })

      window.history.replaceState(history.state, '', '/query/new')

      const editor = QueryEditorNode?.getEditor()
      if (!editor) return

      editor.setValue(data.sql)
    } catch (e) {
      console.error(e)
    }
  }
</script>

<main class="column relative">
  <QueryHead {author} {isAuthor} {onQueryExecute} {quickSave} on:click={onQueryNameClick} />

  <slot />

  <QueryEditor readonly={!isAuthor} bind:this={QueryEditorNode} />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
    min-width: 0;
    height: calc(100vh - 65px);
  }
</style>
