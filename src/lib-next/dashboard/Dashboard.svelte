<script lang="ts">
  import type { TDashboardSqlData } from '$lib/Dashboard/flow/sqlData/api'
  import type { TApiDashboard } from './types'

  import { useDashboardCtx } from './ctx'
  import Header from './Header/Header.svelte'
  import DocumentHeading from './DocumentHeading.svelte'
  import DocumentContent from './DocumentContent/DocumentContent.svelte'
  import { useDashboardParameterWidgetsCtx } from './ctx/parameter-widgets.svelte'
  import { useDashboardSqlQueriesCtx } from './DocumentContent/extensions/query-widget-block-node/ctx/dashboard-queries.svelte'
  import { useDashboardDataWidgets } from './ctx/data-widgets.svelte'
  import { useDashboardSaveFlowCtx } from './flow'

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

  function onDocumentUpdate() {
    scheduleSave()
  }

  function onContentClick() {
    if (dashboard.state.$$.id) return

    scheduleSave()
  }
</script>

<article class="flex-1 gap-4 p-6 px-12 pb-20 column">
  <Header></Header>

  <DocumentHeading onChange={onDocumentUpdate}></DocumentHeading>

  <DocumentContent onclickcapture={onContentClick} onUpdate={onDocumentUpdate}></DocumentContent>
</article>
