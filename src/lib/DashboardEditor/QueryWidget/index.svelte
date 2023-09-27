<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import { getDashboardEditor$Ctx } from '../ctx'
  import { showVisualisationFullscreenDialog } from '$lib/QueryEditor/Visualisation/FullscreenDialog/index.svelte'

  export let widget: App.Dashboard.QueryWidget

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  let sqlData: any

  $: if (process.browser) {
    getData()
  }

  function getData() {
    queryComputeRawClickhouseQuery(`SELECT
  toStartOfMonth(dt) as month,
  min(total_active_market_cap) as low_total_active_market_cap,
  max(total_active_market_cap) as high_total_active_market_cap
FROM (  
SELECT
    dt,
    sum(active_market_cap) AS total_active_market_cap
    FROM
    (
        SELECT
            dt,
            asset_id,
            argMaxIf(value, computed_at, metric_id=dictGet('default.metrics_by_name','metric_id','daily_avg_price_usd')) AS daily_avg_price_usd,
            argMaxIf(value, computed_at, metric_id = dictGet('default.metrics_by_name','metric_id','stack_circulation_365d')) AS stack_circulation_365d,
            daily_avg_price_usd * stack_circulation_365d as active_market_cap
        FROM daily_metrics_v2
        WHERE dt>'2020-01-01' AND metric_id in (dictGet('default.metrics_by_name','metric_id','daily_avg_price_usd'),dictGet('default.metrics_by_name','metric_id','stack_circulation_365d'))
        
        GROUP BY asset_id, dt
        HAVING active_market_cap > 100000 AND active_market_cap < 1000000000000
    )
    GROUP BY dt
    ORDER BY dt
)
group by month
`).then((data) => {
      sqlData = data
    })
  }

  function onFullscreenClick() {
    showVisualisationFullscreenDialog({
      title: widget.title,
      sqlData,
    })
  }

  function onCloseClick() {
    dashboardEditor$.removeWidget(widget)
  }
</script>

<query-widget class="column border">
  <header class="row v-center fluid gap-s">
    <h2 class="body-2">{widget.title}</h2>

    <button
      class="btn-3 mrg-a mrg--l expl-tooltip"
      aria-label="Refresh data"
      on:click={console.log}
    >
      <Svg id="refresh" w="14" />
    </button>

    <button class="btn-3 expl-tooltip" aria-label="Open fullscreen" on:click={onFullscreenClick}>
      <Svg id="fullscreen" w="14" />
    </button>

    <button class="close btn-3 expl-tooltip" aria-label="Remove widget" on:click={onCloseClick}>
      <Svg id="close" w="12" />
    </button>
  </header>

  <Table border={false} {sqlData} />
</query-widget>

<style>
  header {
    padding: 12px 18px 12px 12px;
    border-bottom: 1px solid var(--porcelain);
  }

  Table {
    max-height: calc(100% - 57px);
  }
</style>
