<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import {
    ViewportChart as Chart,
    ApiMetricSeries,
    Minimap,
    DatesRangeShortcuts,
    TimeZoneSelector,
  } from 'san-webkit-next/ui/app/Chart'
  import { getFormattedDetailedTimestamp } from 'san-webkit-next/utils/dates'
  import { useMetricSeriesCtx } from 'san-webkit-next/ui/app/Chart/ctx'
  import { Mode } from 'san-webkit-next/ui/app/Chart/types'
  import PaneLegend from 'san-webkit-next/ui/app/Chart/PaneLegend'
  import { useItemViewportPriorityFlow } from 'san-webkit-next/ctx/viewport-priority'
  import { useTimeZoneCtx } from 'san-webkit-next/ctx/time'
  import { cn } from 'san-webkit-next/ui/utils'

  import TopControls from './TopControls.svelte'

  type TProps = {
    class?: string
    paneLegend: ComponentProps<typeof PaneLegend>['children']
    onFullscreenClick?: () => void
  }

  let { class: className, paneLegend, onFullscreenClick }: TProps = $props()

  const { applyTimeZoneOffset } = useTimeZoneCtx.get()
  const { viewportObserverAction } = useItemViewportPriorityFlow()

  const { metricSeries } = useMetricSeriesCtx.get()

  let mode = $state(Mode.DRAG)

  function timeFormatter(time: number) {
    return getFormattedDetailedTimestamp(applyTimeZoneOffset(new Date(time * 1000)), { utc: true })
  }
</script>

<article
  class={cn(
    'group/chart group relative mb-4 min-h-[920px] rounded-md border bg-white column',
    className,
  )}
  use:viewportObserverAction={{ top: '-100px', bottom: '-100px' }}
>
  <div class="flex-1 p-4 column">
    <TopControls bind:mode {onFullscreenClick}></TopControls>

    <Chart
      bind:mode
      class="min-h-0 flex-1 bg-white [&>div]:!overflow-visible"
      options={{
        handleScroll: { mouseWheel: false },
        handleScale: { mouseWheel: false },
        autoSize: false,
        localization: { timeFormatter },
        timeScale: { rightOffset: 10 },
        layout: { panes: { enableResize: false } },
      }}
      onRangeSelectChange={() => {}}
      onRangeSelectEnd={() => {}}
    >
      {#each metricSeries.$ as item (item.id)}
        <ApiMetricSeries series={item}></ApiMetricSeries>
      {/each}

      <PaneLegend children={paneLegend}></PaneLegend>
    </Chart>

    <Minimap></Minimap>

    <div class="flex text-waterloo">
      <DatesRangeShortcuts></DatesRangeShortcuts>

      <TimeZoneSelector class="ml-auto"></TimeZoneSelector>
    </div>
  </div>
</article>
