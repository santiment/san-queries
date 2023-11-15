<script lang="ts">
  import { queryGenerateTitleBySql } from '$lib/EntityHead/Query/api'
  import { noop } from 'san-webkit/lib/utils'

  export let sql: string
  export let label = 'Use AI'
  export let onSuggestion = noop as (
    suggestion: Awaited<ReturnType<typeof queryGenerateTitleBySql>>,
  ) => void

  let loading = false

  function onClick() {
    loading = true
    queryGenerateTitleBySql(sql)
      .then(onSuggestion)
      .finally(() => {
        loading = false
      })
  }
</script>

{#if loading}
  <div class="loading-spin" />
{:else}
  <button class="expl-tooltip" aria-label={label} on:click={onClick}> ✨ </button>
{/if}

<style>
  .expl-tooltip {
    --expl-left: 22px;
    --expl-position-y: 22px;
  }
</style>
