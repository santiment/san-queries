<script lang="ts">
  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import Resizer from 'webkit/ui/SnapGrid/Resizer.svelte'
  import TextWidget from './TextWidget/index.svelte'
  import HeadingWidget from './HeadingWidget/index.svelte'
  import QueryWidget from './QueryWidget/index.svelte'
  import { normalizeGrid, setItemOptions, sortLayout } from 'webkit/ui/SnapGrid/layout'
  import { getDashboardEditor$Ctx } from './ctx'

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  const cols = 12

  $: ({ widgets } = $dashboardEditor$)
  $: layout = generateLayout(widgets)

  function generateLayout(widgets: App.Dashboard.Widget[]) {
    const layout = widgets.map((widget, i) => {
      return setItemOptions([0, 1000 + i, cols, 2], getGridItemOptions(widget))
    })
    // @ts-ignore
    normalizeGrid(sortLayout(layout))
    return layout as SAN.SnapGrid.Item[]
  }

  function getGridItemOptions(widget: App.Dashboard.Widget) {
    switch (widget.type) {
      case 'TEXT':
      case 'HEADING':
        return {
          minRows: 2,
        }
      default:
        return {
          minRows: 8,
          minCols: 4,
        }
    }
  }
</script>

<!-- @ts-ignore -->
<Grid tag="widgets" {cols} {layout} let:i let:gridItem rowSize={26} minCols={3}>
  {@const widget = widgets[i]}

  <widget use:gridItem class="column">
    {#if widget.type === 'TEXT'}
      <TextWidget {widget} />
    {:else if widget.type === 'HEADING'}
      <HeadingWidget {widget} />
    {:else if widget.type === 'QUERY'}
      <QueryWidget {widget} />
    {/if}

    <Resizer onEnd={console.log} />
  </widget>
</Grid>

<style>
  widget > :global(*) {
    height: 100%;
  }
</style>
