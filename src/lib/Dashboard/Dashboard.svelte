<script lang="ts">
  import { untrack, type ComponentProps } from 'svelte'
  import SaveIndicator from '$lib/SaveIndicator'
  import Header from './Header.svelte'
  import Title from './Title.svelte'
  import { unwrapState, useDashboardEditorCtx } from './ctx/index'
  import Widgets from './Widgets/index.svelte'
  import GlobalParameters from './GlobalParameters/index.svelte'
  import { useDahboardSqlDataCtx } from './flow/sqlData/index.svelte'
  import { useDataFlowCtx } from '$lib/DataFlow/ctx'

  let {
    dashboard,
    isAuthor = false,
    currentUser,
    isLegacy = false,

    onLayoutChange,
    onDuplicateClick,
    onDeleteClick,
  }: {
    dashboard?: App.ApiDashboard
    isAuthor?: boolean
    currentUser: any
    isLegacy?: boolean

    onLayoutChange: () => void
  } & Pick<ComponentProps<Header>, 'onSaveClick' | 'onDuplicateClick' | 'onDeleteClick'> = $props()

  const { dashboardEditor } = useDashboardEditorCtx(dashboard, isAuthor)
  const dahboardSqlDataCtx = useDahboardSqlDataCtx(dashboard)
  const dataFlowCtx = useDataFlowCtx()

  let readonly = $derived(!isAuthor)

  export function getState() {
    return untrack(() => unwrapState(dashboardEditor, dataFlowCtx))
  }
</script>

<SaveIndicator></SaveIndicator>

<article class="flex flex-col gap-4 p-6 pb-20">
  <Header
    {dashboard}
    author={dashboard?.user || currentUser}
    {isAuthor}
    {currentUser}
    {onDuplicateClick}
    {onDeleteClick}
  ></Header>

  <Title name={dashboardEditor.name.$} description={dashboardEditor.description.$} {readonly}
  ></Title>

  <GlobalParameters {isAuthor}></GlobalParameters>

  {#if isLegacy}
    Legacy
  {:else}
    <Widgets {readonly} {onLayoutChange}></Widgets>
  {/if}
</article>
