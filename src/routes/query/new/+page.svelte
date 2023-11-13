<script lang="ts">
  import { GlobalShortcut$ } from 'webkit/utils/events'
  import { notifications$ } from 'webkit/ui/Notifications'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { QueryHead } from '$lib/EntityHead'
  import QueryEditor from '$lib/QueryEditor/index.svelte'
  import { QueryEditor$$ } from './ctx'
  import { mutateCreateSqlQuery } from '$lib/api/query/create'

  import { getSavedJson, saveJson } from 'webkit/utils/localStorage'

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = QueryEditor$$(
    null,
    `SELECT
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
group by month`,
  )

  $: console.log($queryEditor$)

  const saveShortcut = GlobalShortcut$(
    'CMD+S',
    () => {
      const { name, description, query, sql, parameters } = $queryEditor$

      if (!name) {
        notifications$.show({
          type: 'error',
          title: 'Untitled query can not be saved',
          dismissAfter: 5000,
        })

        return
      }

      mutateCreateSqlQuery({
        name,
        description,
        sql,
        isPublic: true,
        parameters,
      }).then((apiQuery) => {
        console.log(apiQuery)
        queryEditor$.setApiQuery(apiQuery)

        saveJson('__QUERIES', [...getSavedJson<any>('__QUERIES', []), apiQuery])

        window.history.replaceState('', history.state, '/query/' + apiQuery.id)

        notifications$.show({
          type: 'success',
          title: query?.id ? 'Query saved' : 'New query created',
          description: 'Query is available in "Work" tab',
          dismissAfter: 5000,
        })
      })
    },
    false,
  )
  $saveShortcut
</script>

<main class="column">
  <QueryHead author={$currentUser$} />

  <QueryEditor />
</main>

<style>
  main {
    flex: 1;
    padding: 0 24px;
    min-width: 0;
  }
</style>
