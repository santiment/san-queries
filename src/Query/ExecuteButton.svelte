<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import ExecutionStats from './ExecutionStats.svelte'

  let stats
  let loading = false
  let lastRun
  let isOpened = false

  function onQueryExecute() {
    if (loading) return
    loading = true
    lastRun = Date.now()
    isOpened = true
  }
</script>

<Tooltip dark isEnabled={stats || loading} closeTimeout={0} bind:isOpened>
  <button slot="trigger" class="btn-1 btn--s row v-center mrg-m mrg--r" on:click={onQueryExecute}>
    {#if loading}
      <div class="loading-spin mrg-s mrg--r" />
      Running
    {:else}
      <Svg id="time" w="16" class="mrg-s mrg--r" />
      Execute
    {/if}
  </button>

  <div slot="tooltip" class="caption">
    <ExecutionStats {stats} {lastRun} />
  </div>
</Tooltip>

<style>
  button {
    width: 99px;
  }

  .loading-spin {
    border-color: #fff;
    border-right-color: #d2d6e7;
  }
</style>
