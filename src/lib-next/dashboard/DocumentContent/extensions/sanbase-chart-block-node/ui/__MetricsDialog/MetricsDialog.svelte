<script module lang="ts">
  import Component from './MetricsDialog.svelte'

  export const showMetricsDialogDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import Dialog, { dialogs$, type TDialogProps } from 'san-webkit-next/ui/core/Dialog'
  import { queryProjectMetrics } from 'san-studio/lib/api/metrics'
  import { getMetricsSelectorGraph } from 'san-studio/lib/metrics/selector/utils'
  import { checkIsFilterMatch } from 'san-studio/lib/metrics/selector/utils'
  import Search from 'san-webkit/lib/ui/Search.svelte'
  import SpinLoader from 'san-webkit/lib/ui/SpinLoader.svelte'
  import { debounce$$ } from 'san-webkit/lib/utils/fn'

  import { getItemsGraph } from './utils'
  import AvailableMetrics from './AvailableMetrics.svelte'
  import { SvelteSet } from 'svelte/reactivity'

  type TProps = TDialogProps & { slug: string; metrics: any[]; onApply: (metrics: any[]) => void }
  let { slug, metrics, onApply, Controller }: TProps = $props()

  let selectedMetrics = new SvelteSet(metrics)
  let searchTerm = $state.raw('')
  let availableMetrics = $state.raw<any[]>([])
  let loading = $state.raw(true)

  let isSearching = $derived(!!searchTerm)
  let categories = $derived(getItemsGraph(filter(searchTerm, availableMetrics)))
  let selectedCategories = $derived(
    Array.from(selectedMetrics).reduce(
      (acc, metric) => {
        acc[metric.category] = acc[metric.category] || 0
        acc[metric.category]++
        return acc
      },
      {} as Record<string, number>,
    ),
  )

  queryProjectMetrics(slug).then((data) => {
    const metricKeys = data.metrics
    loading = false
    availableMetrics = Object.values(getMetricsSelectorGraph(metricKeys, { slug }))
      .flat()
      .filter((metric) => metric && 'category' in metric && metric.category)
  })

  const onSearch$ = debounce$$(250, (value: string) => (searchTerm = value))
  const onInput = ({ currentTarget }: Event) =>
    $onSearch$((currentTarget as HTMLInputElement).value.toLowerCase())

  function filter(searchTerm: string, availableMetrics: any[]) {
    return searchTerm ? availableMetrics.filter(itemFilter) : availableMetrics
  }
  function itemFilter(metric: any) {
    return checkIsFilterMatch(searchTerm, metric)
  }

  function toggleMetric(metric: any) {
    if (selectedMetrics.has(metric.key)) {
      selectedMetrics.delete(metric.key)
    } else {
      selectedMetrics.add(metric.key)
    }

    selectedMetrics = selectedMetrics
  }
</script>

<Dialog class="w-[500px] column">
  <main class="relative min-h-0 column">
    <Search big placeholder="Search for metrics" on:input={onInput} />

    <AvailableMetrics
      {categories}
      {selectedCategories}
      {selectedMetrics}
      {isSearching}
      {toggleMetric}
    />

    {#if loading}
      <SpinLoader />
    {/if}

    <actions class="row center">
      <button
        class="btn-1 fluid"
        onclick={() => {
          onApply([...selectedMetrics])
          Controller.close()
        }}
      >
        Save changes
      </button>
    </actions>
  </main>
</Dialog>

<style lang="scss">
  main {
    padding: 16px;
    flex: 1;
  }

  Search {
    flex-shrink: 0;
  }

  actions {
    padding-top: 20px;
    gap: 8px;
  }

  button {
    --v-padding: 12px;
  }
</style>
