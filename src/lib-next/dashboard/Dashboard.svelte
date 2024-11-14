<script lang="ts">
  import type { TDashboardSqlData } from '$lib/Dashboard/flow/sqlData/api'
  import type { TApiDashboard } from './types'

  import { showDashboardPublishedDialog$ } from '$lib/DashboardPublishedDialog/index.svelte'
  import { useDashboardCtx } from './ctx'
  import Header from './Header/Header.svelte'
  import DocumentHeading from './DocumentHeading.svelte'
  import DocumentContent from './DocumentContent/DocumentContent.svelte'
  import { useDashboardParameterWidgetsCtx } from './ctx/parameter-widgets.svelte'
  import { useDashboardSqlQueriesCtx } from './ctx/dashboard-queries.svelte'
  import { useDashboardDataWidgets } from './ctx/data-widgets.svelte'
  import { useDashboardSaveFlowCtx } from './flow'
  import { usePublishToggleFlow } from './flow/publish'
  import { useDashboardDuplicateFlow } from '$lib/Dashboard/flow/duplicate'

  type TProps = {
    apiDashboard: undefined | null | TApiDashboard<any>
    cache?: null | TDashboardSqlData[]
    readonly?: boolean
  }
  let { apiDashboard, cache, readonly = true }: TProps = $props()

  const { dashboard } = useDashboardCtx.set(apiDashboard, readonly)

  useDashboardSqlQueriesCtx.set(apiDashboard, cache)

  useDashboardParameterWidgetsCtx.set()
  useDashboardDataWidgets.set()

  const { scheduleSave } = useDashboardSaveFlowCtx.set()
  const { onDuplicateClick } = useDashboardDuplicateFlow()
  const { publishDashboard, unpublishDashboard } = dashboard.isCurrentUserAuthor
    ? usePublishToggleFlow()
    : {}

  const showDashboardPublishedDialog = showDashboardPublishedDialog$()

  function onDocumentUpdate() {
    scheduleSave()
  }

  function onContentClick() {
    if (dashboard.state.$$.id) return

    scheduleSave()
  }

  function onPublishToggle() {
    const { id, isPublic } = dashboard.state.$$

    if (!id || !unpublishDashboard || !publishDashboard) {
      return
    }

    const action = isPublic ? unpublishDashboard : publishDashboard

    action({ id, onComplete })

    function onComplete() {
      dashboard.state.$$.isPublic = !isPublic
      if (!isPublic) showDashboardPublishedDialog()
    }
  }
</script>

<article class="flex-1 gap-4 p-6 px-12 pb-20 column">
  <Header {onPublishToggle} onDataUpdateClick={console.log} {onDuplicateClick}></Header>

  <DocumentHeading onChange={onDocumentUpdate}></DocumentHeading>

  <DocumentContent onclickcapture={onContentClick} onUpdate={onDocumentUpdate}></DocumentContent>
</article>
