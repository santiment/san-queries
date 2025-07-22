<script lang="ts">
  import type { NarrativesType } from './types.js'

  import * as d3 from 'd3'
  import Button from 'san-webkit-next/ui/core/Button'
  import { cn } from 'san-webkit-next/ui/utils'
  import { SvelteSet } from 'svelte/reactivity'

  import Chart from './Chart.svelte'

  const [_, NARRATIVES] = Object.entries(
    import.meta.glob<NarrativesType>('./data/*.ts', {
      eager: true,
      import: 'NARRATIVES',
    }),
  )[0]!

  type TProps = {
    class?: string
  }

  const { class: className = '' }: TProps = $props()

  let narrativesNode = $state<HTMLElement>()
  let active = $state<string | null>(null)
  let hiddenGroups = new SvelteSet<string>()

  const currentDataset = $derived(NARRATIVES)
  const filteredDataset = $derived({
    ...currentDataset,
    datasets: currentDataset.datasets.filter(({ label }) => !hiddenGroups.has(label)),
  })
  const keys = $derived(currentDataset.datasets.map(({ label }) => label))
  const colorScale = $derived(d3.scaleOrdinal(d3.schemeTableau10).domain(keys))

  function onChartHover(label: string | null) {
    active = label

    if (!label) return
    const index = keys.indexOf(label)
    const node = narrativesNode?.children[index]
    if (!node) return

    node.scrollIntoView({ behavior: 'smooth' })
  }

  function toggleGroup(key: string) {
    if (hiddenGroups.has(key)) {
      hiddenGroups.delete(key)
    } else {
      hiddenGroups.add(key)
    }
  }
</script>

<div class={cn('flex h-[900px] w-full flex-col', className)}>
  <h2 class="flex items-center justify-between border-b px-5 py-2 pr-3 text-xl">Topics</h2>
  <div class="flex overflow-hidden lg:flex-col">
    <section
      bind:this={narrativesNode}
      class={cn(
        'flex w-[30%] min-w-[400px] max-w-[30%] flex-col gap-8 overflow-auto px-5 py-3',
        'lg:w-full lg:min-w-0 lg:max-w-full',
      )}
    >
      {#each currentDataset.datasets as { label, topics, description }, i}
        <article
          class={cn(
            'flex flex-col gap-1 py-1.5 pr-3',
            'rounded hover:bg-athens',
            active === label && 'bg-athens',
          )}
          data-i={i}
          onmouseenter={() => (active = label)}
          onmouseleave={() => (active = null)}
        >
          <h3 class="text-lg font-medium">
            {label || topics}
          </h3>
          <h4 class="font-medium text-waterloo">
            Top words: {topics}
          </h4>
          <p>{description}</p>
        </article>
      {/each}
    </section>

    <section class="flex w-full min-w-0 flex-col px-3 py-4 lg:min-h-[65%]">
      <section class="flex flex-nowrap gap-2 overflow-auto px-6">
        {#each keys as key}
          <Button
            class={cn(
              'flex items-center gap-2 whitespace-nowrap',
              hiddenGroups.has(key) && 'text-fiord opacity-50',
            )}
            onclick={() => toggleGroup(key)}
            onmouseenter={() => onChartHover(key)}
            onmouseleave={() => onChartHover(null)}
          >
            <div class="h-3 w-5 rounded-full" style:background-color={colorScale(key)}></div>
            {key}
          </Button>
        {/each}
      </section>

      <section class="h-full w-full flex-1 self-center p-3">
        <Chart {active} onHover={onChartHover} narrativesData={filteredDataset} {colorScale} />
      </section>
    </section>
  </div>
</div>
