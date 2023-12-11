<script lang="ts">
  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import Resizer from 'webkit/ui/SnapGrid/Resizer.svelte'
  import TextWidget from './TextWidget/index.svelte'
  import HeadingWidget from './HeadingWidget/index.svelte'
  import QueryWidget from './QueryWidget/index.svelte'
  import ImageWidget from './ImageWidget/index.svelte'
  // import { getDashboardEditor$Ctx } from './ctx'
  import { getDevice$Ctx } from 'san-webkit/lib/stores/responsive'
  import { normalizeGrid, sortLayout } from 'san-webkit/lib/ui/SnapGrid/layout'
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import { EventAutoSave$ } from '$routes/(editor)/query/events'

  const { dashboardEditor$ } = getDashboardEditor$Ctx()
  const { device$ } = getDevice$Ctx()

  const cols = 12

  $: device = $device$
  $: dashboardEditor = $dashboardEditor$
  $: ({ widgets, layout } = dashboardEditor)
  $: _layout = adaptLayoutToDevice(layout, device.isMobile)

  function adaptLayoutToDevice(layout: any[], isMobile = false) {
    if (isMobile === false) return layout

    layout = layout.map((item) => {
      const mobileItem = item.slice()
      mobileItem[0] = 0
      mobileItem[2] = cols
      return mobileItem
    })

    normalizeGrid(sortLayout(layout))

    return layout
  }

  function hook(node: HTMLElement, widget: App.Dashboard.Widget) {
    widget.htmlNode = node
    setTimeout(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  function onLayoutChange() {
    dashboardEditor$.updateLayout()
    EventAutoSave$.dispatch()
  }
</script>

<Grid
  tag="widgets"
  {cols}
  layout={_layout}
  let:i
  let:gridItem
  rowSize={26}
  minCols={3}
  readonly={device.isMobile}
  {onLayoutChange}
>
  {@const widget = widgets[i]}

  <widget use:hook={widget} use:gridItem class="column">
    {#if widget.type === 'TEXT'}
      <TextWidget {widget} />
    {:else if widget.type === 'HEADING'}
      <HeadingWidget {widget} />
    {:else if widget.type === 'QUERY'}
      <QueryWidget {widget} />
    {:else if widget.type === 'IMAGE'}
      <ImageWidget {widget} />
    {/if}

    <Resizer onEnd={onLayoutChange} />
  </widget>
</Grid>

<style>
  widget > :global(*) {
    height: 100%;
  }
</style>
