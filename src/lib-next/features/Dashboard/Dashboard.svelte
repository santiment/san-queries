<script lang="ts">
  import { useDashboardCtx } from './ctx'
  import Header from './Header/Header.svelte'
  import DocumentHeading from './DocumentHeading.svelte'
  import DocumentContent from './DocumentContent/DocumentContent.svelte'
  import { useDashboardGlobalParametersCtx } from './ctx/global-parameters.svelte'
  import { useDashboardSqlQueriesCtx } from './DocumentContent/extensions/query-widget-block-node/ctx/dashboard-queries.svelte'
  import { useDashboardDataWidgetsFlow } from './ctx/data-widgets.svelte'
  import type { TDashboardSqlData } from '$lib/Dashboard/flow/sqlData/api'

  type TProps = {
    apiDashboard: undefined | null | App.ApiDashboard
    cache?: null | TDashboardSqlData[]
    readonly?: boolean
  }
  let { apiDashboard, cache, readonly = true }: TProps = $props()

  const ctx = useDashboardCtx(apiDashboard, readonly)
  useDashboardSqlQueriesCtx(apiDashboard, cache)

  useDashboardGlobalParametersCtx.set()
  useDashboardDataWidgetsFlow.set()

  console.log(ctx)
</script>

<article class="flex-1 gap-4 p-6 px-12 pb-20 column">
  <Header></Header>

  <DocumentHeading></DocumentHeading>

  <DocumentContent></DocumentContent>
</article>
