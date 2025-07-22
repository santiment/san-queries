<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import type { MouseEventHandler } from 'svelte/elements'
  import type { NarrativesType } from './types'

  import * as d3 from 'd3'
  import { noop } from 'san-webkit/lib/utils'
  import { cn } from 'san-webkit-next/ui/utils'

  import Tooltip from './Tooltip.svelte'

  type TooltipData = Omit<ComponentProps<typeof Tooltip>, 'elem'>

  type TProps = {
    narrativesData: NarrativesType
    active: string | null
    onHover?: (label: string | null) => void
    colorScale: d3.ScaleOrdinal<string, string>
  }

  const { active, onHover = noop, colorScale, narrativesData }: TProps = $props()

  const margin = { top: 0, right: 40, bottom: 40, left: 40 }

  let gx = $state<SVGElement>()
  let containerWidth = $state(0)
  let containerHeight = $state(0)
  let tooltipData = $state<TooltipData | null>(null)
  let tooltip = $state<HTMLElement>()

  const totalGraphsPoints = $derived(
    narrativesData.datasets.reduce((total, { data }) => {
      const max = getAreaMaxPoint(data)
      const median = getAreaMedianPoint(data)
      return Math.max(max, total + median)
    }, 0),
  )

  const gapBetweenGraphsInPoints = $derived(
    (totalGraphsPoints / narrativesData.datasets.length) * 0.5,
  )
  const graphHeightInPoints = $derived(getAreaYOffset(narrativesData.datasets.length - 1))

  const hasActive = $derived(active != null)
  const chartWidth = $derived(containerWidth)
  const chartHeight = $derived(containerHeight)
  const graphWidth = $derived(chartWidth - margin.left - margin.right)
  const graphHeight = $derived(chartHeight - margin.top - margin.bottom)

  const xScale = $derived(
    d3
      .scaleLinear()
      .domain([0, narrativesData.labels.length - 1])
      .range([0, graphWidth]),
  )
  const yScale = $derived(d3.scaleLinear().domain([0, graphHeightInPoints]).range([graphHeight, 0]))

  const areaBuilder = $derived(
    d3
      .area<number>()
      .x((_, i) => xScale(i))
      .y0(() => yScale(0))
      .y1((d) => yScale(d))
      .curve(d3.curveBasis),
  )

  $effect(() => {
    d3.select(gx as SVGSVGElement)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(6)
          .tickFormat((value) => narrativesData.labels[value.valueOf()]),
      )
      .call((g) => g.selectAll('.domain').attr('stroke', 'var(--mystic)'))
      .call((g) =>
        g
          .selectAll('.tick line')
          .attr('y1', -1 * graphHeight)
          .attr('stroke', 'var(--mystic)'),
      )
  })

  const calculateTooltipData: MouseEventHandler<SVGGElement> = ({ offsetX, offsetY }) => {
    const pointX = Math.round(xScale.invert(offsetX - margin.left))

    if (Number.isFinite(active) === false) return

    const activeGroup = narrativesData.datasets.find(({ label }) => label === active)
    if (!activeGroup) return

    const { data, label, topics } = activeGroup

    const tooltipWidth = tooltip ? tooltip.clientWidth : 0
    const invertLeft = pointX > narrativesData.labels.length / 2
    const leftOffset = invertLeft ? tooltipWidth : 0

    tooltipData = {
      top: offsetY,
      left: xScale(pointX) + margin.left - leftOffset,
      color: colorScale(label),
      date: narrativesData.labels[pointX],
      value: data[pointX],
      groupTitle: label || topics,
    }
  }

  function getAreaMaxPoint(points: number[]) {
    return d3.max(points) ?? 0
  }

  function getAreaMedianPoint(points: number[]) {
    return d3.median(points) ?? 0
  }

  function getAreaYOffset(index: number): number {
    let total = 0

    for (let i = 0; i <= index; i++) {
      const { data } = narrativesData.datasets[i]

      const median = getAreaMedianPoint(data)
      const max = getAreaMaxPoint(data)

      total = Math.max(total + median, max)

      if (i !== 0) {
        total = total + gapBetweenGraphsInPoints
      }
    }

    return total
  }

  function getAreaPosition(index: number) {
    const points = getAreaYOffset(index)
    return -yScale(points)
  }
</script>

<chart
  class="relative block h-full w-full"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
>
  <svg width={chartWidth} height={chartHeight}>
    <g bind:this={gx} transform="translate({margin.left}, {margin.top + graphHeight})" />

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <g
      class="group"
      width={graphWidth}
      height={graphHeight}
      transform="translate({margin.left}, {margin.top})"
      onmousemove={calculateTooltipData}
      onmouseleave={() => {
        onHover(null)
        tooltipData = null
      }}
    >
      {#each narrativesData.datasets as { label, data }, i}
        {@const color = colorScale(label)}

        <path
          class={cn(
            'transition-[opacity,filter]',
            hasActive && active !== label && 'opacity-40 saturate-50',
            'group-hover:opacity-40 group-hover:saturate-50',
            'group-hover:hover:opacity-100 group-hover:hover:saturate-100',
          )}
          transform="translate(0, {getAreaPosition(i)})"
          d={areaBuilder(data)}
          opacity={1}
          stroke={color}
          fill={color}
          fill-opacity={1}
          onmouseenter={() => onHover(label)}
        />
      {/each}
    </g>
  </svg>

  {#if tooltipData}
    <Tooltip bind:elem={tooltip} {...tooltipData} />
  {/if}
</chart>
