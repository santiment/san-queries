<script>
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import QueryHead from '$lib/QueryHead/index.svelte'
  import QueryEditor from '$lib/QueryEditor/index.svelte'
  import { QueryEditor$$ } from './ctx'

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(`SELECT
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
`)
</script>

<main class="column">
  <QueryHead author={$currentUser$} sql={$queryEditor$.sql} />

  <QueryEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
  }
</style>
