<script lang="ts">
  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import Resizer from 'webkit/ui/SnapGrid/Resizer.svelte'
  import TextWidget from './TextWidget/index.svelte'
  import HeadingWidget from './HeadingWidget/index.svelte'
  import QueryWidget from './QueryWidget/index.svelte'
  import ImageWidget from './ImageWidget/index.svelte'
  import { getDashboardEditor$Ctx } from './ctx'
  import { getDevice$Ctx } from 'san-webkit/lib/stores/responsive'
  import { normalizeGrid, sortLayout } from 'san-webkit/lib/ui/SnapGrid/layout'

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  const { device$ } = getDevice$Ctx()
  const cols = 12

  $: device = $device$
  $: ({ widgets, layout } = $dashboardEditor$)

  $: if (process.browser) {
    // dashboardEditor$.responsiveLayout(device.isMobile)
    reset(device.isMobile)
  }

  $: _layout = layout
  function reset(isMobile = false) {
    let local = layout

    if (isMobile) {
      local = layout.map((item) => {
        const _item = item.slice() as any
        _item[0] = 0
        _item[2] = 12
        return _item
      })
    } else {
      local = layout
    }

    normalizeGrid(sortLayout(local))

    _layout = local
  }

  function hook(node: HTMLElement, widget: App.Dashboard.Widget) {
    widget.htmlNode = node
    setTimeout(() => {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
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
  onLayoutChange={() => {
    dashboardEditor$.updateLayout()
  }}
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

    <Resizer onEnd={() => console.log(widget, layout)} />
  </widget>
</Grid>

<style>
  widget > :global(*) {
    height: 100%;
  }
</style>
