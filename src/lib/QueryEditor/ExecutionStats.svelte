<script lang="ts">
  import Tooltip from 'webkit/ui/Tooltip'
  import Svg from 'webkit/ui/Svg/svelte'
  import { queryExecutionStats } from '$lib/api/query'
  import { track } from 'san-webkit/lib/analytics'

  export let sqlData: App.SqlData

  function onButtonClick() {
    track.event('query_stats_click', {
      category: 'Interaction',
      source_url: window.location.href,
      was_executed: !!sqlData.clickhouseQueryId,
      id: sqlData.clickhouseQueryId,
    })
  }
</script>

<Tooltip
  on="click"
  let:trigger
  position="bottom"
  class="border"
  margin={4}
  openDelay={sqlData.clickhouseQueryId ? 0 : 99999}
>
  <button
    on:click={onButtonClick}
    use:trigger
    class="btn-3 expl-tooltip"
    class:adjusted={!sqlData.clickhouseQueryId}
    aria-label={sqlData.clickhouseQueryId
      ? 'Execution stats'
      : 'Please execute the query to calculate the credits'}
  >
    <Svg id="coin" w="16" />
  </button>

  <execution-stats slot="tooltip" class="column hv-center c-black">
    {#await queryExecutionStats(sqlData.clickhouseQueryId)}
      <loading-spin />
    {:then stats}
      <stat class="row">Query ID <value>{sqlData.clickhouseQueryId}</value></stat>
      <stat class="row">Credits used <value>{stats.creditsCost}</value></stat>
      <stat class="row">Duration <value>{stats.queryDurationMs} ms</value></stat>
      <stat class="row">GB read <value>{stats.readGb} GB</value></stat>
      <stat class="row">Rows read <value>{stats.readRows}</value></stat>
      <stat class="row">Inserted at <value>{stats.insertedAt}</value></stat>
    {/await}
  </execution-stats>
</Tooltip>

<style>
  .adjusted {
    --expl-right: -64px;
  }

  stat {
    padding: 12px 16px;
    justify-content: space-between;
    gap: 80px;
    border-bottom: 1px solid var(--porcelain);
    width: 100%;
  }

  stat:last-of-type {
    border: none;
  }

  execution-stats {
    min-width: 307px;
    min-height: 269px;
  }

  loading-spin {
    --loading-size: 30px;
    border-width: 4px;
  }
</style>
