<script lang="ts">
  import type { PageData } from './$types'
  import type { ComponentProps } from 'svelte'

  import { ss, ssd, useStore } from 'svelte-runes'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import { GlobalShortcut$ } from 'san-webkit/lib/utils/events'
  import QueryEditor from '$lib/QueryEditor/QueryEditor.svelte'
  import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
  import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
  import { useQueryDuplicateFlow } from '$lib/QueryEditor/flow/duplicate.svelte'
  import { useQueryDeleteFlow } from '$lib/QueryEditor/flow/delete.svelte'
  import {
    useAutoSaveFlow,
    useSaveEmptyFlow,
    useSaveFlow,
  } from '$lib/QueryEditor/flow/autoSave.svelte'

  let { data }: { data: PageData } = $props()
  const { currentUser$ } = getCurrentUser$Ctx()
  const _saveIndicatorCtx = useSaveIndicatorCtx()
  const changeIndicatorCtx = useChangeIndicatorCtx()
  const QueryEditorRef = ss<QueryEditor>()
  const apiQuery = ssd(() => data.apiQuery)

  $inspect(data)

  let currentUser = $currentUser$
  let isAuthor = ssd(() => (apiQuery.$ ? +apiQuery.$.user.id === +currentUser?.id! : true))

  useAutoSaveFlow(QueryEditorRef, isAuthor)
  const { saveQuery } = useSaveFlow(QueryEditorRef, isAuthor)
  const { saveEmptyQuery } = useSaveEmptyFlow(apiQuery, QueryEditorRef)
  const { onDuplicateClick } = useQueryDuplicateFlow(apiQuery, QueryEditorRef)
  const { onDeleteClick } = useQueryDeleteFlow(apiQuery)

  useStore(GlobalShortcut$('CMD+S', () => saveQuery(), false))

  const onSqlChange: NonNullable<ComponentProps<QueryEditor>['onSqlChange']> = (
    saveEditorState,
  ) => {
    if (apiQuery.$) return changeIndicatorCtx.emit.changed()

    return saveEmptyQuery(saveEditorState)
  }
</script>

{#key apiQuery.$?.id}
  <QueryEditor
    bind:this={QueryEditorRef.$}
    query={apiQuery.$}
    {currentUser}
    isAuthor={isAuthor.$}
    {onDuplicateClick}
    {onDeleteClick}
    {onSqlChange}
    onSaveClick={saveQuery}
    onParametersChange={() => changeIndicatorCtx.emit.changed()}
  ></QueryEditor>
{/key}
