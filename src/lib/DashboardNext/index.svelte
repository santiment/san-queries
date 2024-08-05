<script lang="ts">
  import { untrack, type ComponentProps } from 'svelte'

  import Title from '$lib/Dashboard/Title.svelte'
  import Header from '$lib/Dashboard/Header.svelte'
  import {
    unwrapState,
    useDashboardEditorCtx,
    useDashboardWidgets,
    useQueryColumnActionsCtx,
    useServerDashboardCacheCtx,
  } from './ctx'
  import BlockEditor from './BlockEditor/index.svelte'
  import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
  import { showAddQueryToDashboardDialog$ } from '$lib/AddQueryToDashboardDialog/index.svelte'
  import { useCleanFlow } from './clean.svelte'
  import { useDataRefreshPromptCtx, usePersistentSessionFlow } from './state.svelte'
  import Prompt from './Prompt.svelte'
  import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'

  let {
    dashboard,
    currentUser,

    readonly = true,
    isAuthor = false,
    isLegacy = false,

    onDuplicateClick,
    onDeleteClick,
  }: {
    dashboard?: App.ApiDashboard
    currentUser: any
    readonly?: boolean
    isAuthor?: boolean
    isLegacy?: boolean
  } & Pick<ComponentProps<Header>, 'onSaveClick' | 'onDuplicateClick' | 'onDeleteClick'> = $props()

  let BlockEditorRef: BlockEditor

  const showAddQueryToDashboardDialog = showAddQueryToDashboardDialog$()

  useServerDashboardCacheCtx()
  const { dashboardEditor } = useDashboardEditorCtx(dashboard, isAuthor, readonly)
  const dahboardSqlDataCtx = useDahboardSqlDataCtx(dashboard)
  const { addQueryWidget } = useDashboardWidgets(dashboard, dahboardSqlDataCtx.dashboardData)
  const { changedParameters, queryParameterChanges } = useDataRefreshPromptCtx()
  const { saveLocalSession, applySavedSession } = usePersistentSessionFlow(getEditor)
  useQueryColumnActionsCtx()
  const { dashboardWidgets } = useDashboardWidgets.get()

  useCleanFlow(getEditor)

  const changeIndicatorCtx = useChangeIndicatorCtx()

  function getEditor() {
    return BlockEditorRef?.getEditor?.()
  }

  export function getState() {
    return untrack(() =>
      unwrapState(
        dashboardEditor,
        dashboardWidgets,
        dahboardSqlDataCtx.dashboardData,
        BlockEditorRef?.getEditor(),
      ),
    )
  }

  let saveTimeout: any

  function onUpdate() {
    if (dashboardEditor.readonly) {
      saveLocalSession()
    } else {
      window.clearTimeout(saveTimeout)
      saveTimeout = setTimeout(() => {
        changeIndicatorCtx.emit.changed()
      }, 2200)
    }
  }

  $effect(() => () => window.clearTimeout(saveTimeout))

  function onEmptyEditorClick(e: MouseEvent) {
    e.preventDefault()
    e.stopImmediatePropagation()
    document.querySelector('h1')?.focus()
  }
</script>

<div class="flex flex-1 flex-col gap-4 p-6 px-12 pb-20 max-[1000px]:px-4">
  <Header
    {dashboard}
    author={dashboard?.user || currentUser}
    {currentUser}
    {onDuplicateClick}
    {onDeleteClick}
    onUpdateClick={queryParameterChanges}
  ></Header>

  <Title></Title>

  <BlockEditor
    bind:this={BlockEditorRef}
    {readonly}
    {onUpdate}
    content={dashboardEditor.documentContent}
    editorProps={{
      addQueryWidget,
      showAddQueryToDashboardDialog: (props) =>
        showAddQueryToDashboardDialog({ ...props, dashboardId: dashboardEditor.id }),
    }}
    onclickcapture={dashboardEditor.id ? undefined : onEmptyEditorClick}
  ></BlockEditor>

  {#if applySavedSession.$}
    <Prompt icon="logout" onClick={applySavedSession.$}>Restore last session</Prompt>
  {:else if changedParameters.$.size}
    <Prompt icon="refresh" onClick={queryParameterChanges}>
      {readonly ? 'Refresh data' : 'Update default data'}
    </Prompt>
  {/if}
</div>
