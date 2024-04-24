<script lang="ts">
  import { slide } from 'svelte/transition'
  import { debounce$$ } from 'san-webkit/lib/utils/fn'

  import { ALERT_METRICS, queryAvailableMetrics } from './metrics'
  import Metric from './Metric.svelte'
  import Search from '../Search.svelte'
  import { getItemsGraph } from '$lib/utils/graph'

  let className = ''
  export { className as class }
  export let metric: null | any = null
  export let selectMetric: any
  export let slugs: string[]
  export let metrics = ALERT_METRICS

  let openedCategory = new Set<string>(['Financial'])
  let searchTerm = ''

  $: filtered = searchTerm ? filter(metrics) : metrics
  $: categories = getItemsGraph(filtered)

  Promise.all(slugs.map((slug) => queryAvailableMetrics(slug)))
    .then((slugsMetrics) => {
      if (slugs.length < 2) {
        return new Set(slugsMetrics[0])
      }

      let smallest = Infinity
      let smallestIndex = 0
      slugsMetrics.forEach((metrics, i) => {
        if (metrics.length < smallest) {
          smallest = metrics.length
          smallestIndex = i
        }
      })

      const rest = slugsMetrics.slice()
      const metrics = new Set(...rest.splice(smallestIndex, 1))
      const restMetrics = new Set(rest.flat())

      metrics.forEach((metric) => {
        if (restMetrics.has(metric) === false) {
          metrics.delete(metric)
        }
      })

      return metrics
    })
    .then((data) => {
      metrics = ALERT_METRICS.filter((metric) => data.has(metric.key))
    })

  function filter(items: any[]) {
    const search = searchTerm.toLowerCase()
    return items.filter((item) => matchMetric(item, search))
  }

  function matchMetric(metric: any, searchTerm: string) {
    return metric.label.toLowerCase().includes(searchTerm)
  }

  const onSearch$ = debounce$$(250, (value: string) => (searchTerm = value))
  const onInput = ({ currentTarget }: any) => $onSearch$(currentTarget.value)

  function onCategoryClick(category: string) {
    if (openedCategory.has(category)) {
      openedCategory.delete(category)
    } else {
      openedCategory.add(category)
    }

    openedCategory = openedCategory
  }
</script>

<Search placeholder="Search for metric" on:input={onInput} />

{#if metric}
  <Metric {metric} class="mb-3 text-left" />
{/if}

<section class={className}>
  <metrics class="column">
    {#each categories as groups}
      {@const category = groups[0][0].category}
      {@const isOpened = openedCategory.has(category)}

      <button
        class="category btn row v-center justify txt-b"
        class:opened={isOpened}
        on:click={() => onCategoryClick(category)}
      >
        {category}
      </button>

      {#if isOpened || searchTerm}
        <div class="metrics column c-fiord ml-4" transition:slide|local>
          {#each groups as metrics}
            {@const { group } = metrics[0]}

            {#if group}
              <h4 class="caption txt-b c-waterloo group">{group}</h4>
            {/if}

            {#each metrics as metric (metric.key)}
              <button class="metric btn text-left" on:click={() => selectMetric(metric)}>
                {metric.label}
              </button>
            {/each}
          {/each}
        </div>
      {/if}
    {/each}
  </metrics>
</section>

<style>
  .category {
    padding: 10px 16px;
    --bg: var(--athens);
    --color-hover: var(--green);
    --fill: var(--waterloo);
  }

  .opened {
    --bg: var(--green-light-1);
    --fill: var(--waterloo);
  }

  .category,
  .metrics {
    margin: 0 0 8px;
  }

  .metrics {
    padding-left: 12px;
    border-left: 1px solid var(--porcelain);
  }

  .group {
    line-height: 32px;
  }

  .metric {
    padding: 6px 12px 6px 0;
    --color-hover: var(--green);
  }
</style>
