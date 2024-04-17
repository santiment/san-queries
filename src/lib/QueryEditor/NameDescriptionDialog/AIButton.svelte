<script lang="ts">
  import { useObserve } from 'svelte-runes'
  import { tap } from 'rxjs'
  import { useAiSuggestion } from '../flow/ai'

  let {
    sql,
    label,
    onSuggestion,
  }: { sql: string; label?: string; onSuggestion: (data: any) => void } = $props()

  let loading = $state(false)

  const { data$, getAiTitleAndDescription } = useAiSuggestion()

  useObserve(() =>
    data$.pipe(
      tap(() => (loading = false)),
      tap(onSuggestion),
    ),
  )

  function onClick() {
    loading = true
    getAiTitleAndDescription(sql)
  }
</script>

{#if loading}
  <div class="loading-spin" />
{:else}
  <button class="expl-tooltip" aria-label={label} onclick={onClick}> ✨ </button>
{/if}

<style>
  .expl-tooltip {
    --expl-left: 22px;
    --expl-position-y: 22px;
  }
</style>
