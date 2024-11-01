<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { SvelteSet } from 'svelte/reactivity'

  export let categories: any[]
  export let selectedCategories: Record<string, number>
  export let selectedMetrics: Set<any>
  export let isSearching: boolean
  export let toggleMetric: any

  let openedCategory = new SvelteSet<string>(['Financial'])

  function onCategoryClick(category: string) {
    if (openedCategory.has(category)) openedCategory.delete(category)
    else openedCategory.add(category)

    openedCategory = openedCategory
  }
</script>

<div class="metrics max-h-full min-h-0 overflow-auto column">
  {#each categories as groups}
    {@const category = groups[0][0].category}
    {@const isOpened = isSearching || openedCategory.has(category)}
    {@const amountOfSelectedMetrics = selectedCategories[category]}

    <button
      class="category fluid items-center font-bold row"
      on:click={() => onCategoryClick(category)}
    >
      {category}
      {#if amountOfSelectedMetrics}
        <span class="c-green mrg-xs mrg--l">
          ({amountOfSelectedMetrics})
        </span>
      {/if}

      <Svg id="arrow-down" w="14" class="ml-auto {isOpened ? '$style.opened' : ''}" />
    </button>

    {#if isOpened}
      <section class="c-fiord column">
        {#each groups as metrics}
          {@const { group } = metrics[0]}

          {#if group}
            <h4 class="caption txt-b c-waterloo group">{group}</h4>
          {/if}

          {#each metrics as metric (metric.key)}
            {@const selected = selectedMetrics.has(metric)}
            <button
              class="metric btn v-center justify row"
              class:selected
              on:click={() => toggleMetric(metric)}
            >
              <span class="single-line">
                {metric.label}
              </span>

              {#if selected}
                <Svg id={selected ? 'delete' : 'plus-circle'} w="16" />
              {/if}
            </button>
          {/each}
        {/each}
      </section>
    {/if}
  {/each}
</div>

<style lang="scss">
  .metrics {
    overflow: auto;
  }

  .category {
    --fill: var(--waterloo);
    padding: 18px 12px;
    border-top: 1px solid var(--porcelain);
    border-radius: 0;

    &:first-of-type {
      margin: 0;
      border: none;
    }
  }

  section {
    margin: -10px 0 24px 12px;
  }

  .opened {
    transform: rotate(180deg);
    fill: var(--green);
  }

  .metric {
    padding: 8px 10px 8px 0;
    gap: 24px;
  }

  .group {
    margin: 24px 0 8px;
  }

  .selected {
    --color: var(--green);
    --fill: var(--waterloo);
    --fill-hover: var(--waterloo);
  }
</style>
