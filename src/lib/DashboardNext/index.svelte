<script lang="ts">
  import { untrack, type ComponentProps } from 'svelte'

  import Title from '$lib/Dashboard/Title.svelte'
  import Header from '$lib/Dashboard/Header.svelte'
  import { useDashboardEditorCtx, useServerDashboardCacheCtx } from './ctx'
  import BlockEditor from './BlockEditor/index.svelte'
  import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'

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

  useServerDashboardCacheCtx()
  const { dashboardEditor } = useDashboardEditorCtx(dashboard, isAuthor, readonly)
  const dahboardSqlDataCtx = useDahboardSqlDataCtx(dashboard)
</script>

<div class="flex flex-1 flex-col gap-4 p-6 px-12 pb-20">
  <Header
    {dashboard}
    author={dashboard?.user || currentUser}
    {currentUser}
    {onDuplicateClick}
    {onDeleteClick}
  ></Header>

  <Title></Title>

  <BlockEditor {readonly} content={dashboardEditor.__editorJson}></BlockEditor>
</div>
