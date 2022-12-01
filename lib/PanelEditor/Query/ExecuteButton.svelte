<script>import { onDestroy } from 'svelte';
import { CMD } from 'san-webkit/lib/utils/os';
import { newGlobalShortcut } from 'san-webkit/lib/utils/events';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import ExecutionStats from './ExecutionStats.svelte';
export let onClick;
export let onError;
let stats;
let loading = false;
let lastRun;
let isOpened = false;

function onQueryExecute() {
  if (loading) return;
  loading = true;
  lastRun = Date.now();
  isOpened = true;
  onClick(() => {
    loading = false;
    const resultOn = Date.now();
    stats = {
      resultOn,
      loadTime: resultOn - lastRun
    };
  }).catch(e => {
    loading = false;
    const {
      message,
      details
    } = e[0] || e;
    const errorMessage = message || details || 'Error';
    const msgIndex = errorMessage.indexOf(' ', errorMessage.indexOf('JSONCompact')) + 1;
    let msg = errorMessage.slice(msgIndex).trim();

    if (msg === 'unauthorized') {
      msg = 'Please sign in to run the query.';
    }

    return onError(msg);
  });
}

onDestroy(newGlobalShortcut('CMD+ENTER', onQueryExecute, false));</script>

<Tooltip dark isEnabled={stats || loading} closeTimeout={0} bind:isOpened>
  <button
    slot="trigger"
    class="btn-1 btn--s row hv-center mrg-l mrg--r expl-tooltip"
    class:loading
    aria-label="{CMD} + Enter"
    on:click={onQueryExecute}>
    <!-- 
    {#if loading}
      <div class="loading-spin mrg-s mrg--r" />
      Running
    {:else}
 -->
    Execute
    <!-- {/if} -->
  </button>

  <div slot="tooltip" class="caption">
    <ExecutionStats {loading} {stats} {lastRun} />
  </div>
</Tooltip>

<style>
  button {
    /* width: 140px; */
    padding: 6px 30px;
  }

  .loading {
    pointer-events: all;
  }

  .loading-spin {
    border-color: #fff;
    border-right-color: #d2d6e7;
  }
</style>
