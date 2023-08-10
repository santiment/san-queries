<script lang="ts">
  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import Resizer from 'webkit/ui/SnapGrid/Resizer.svelte'
  import TextWidget from './TextWidget/index.svelte'
  import HeadingWidget from './HeadingWidget/index.svelte'
  import { normalizeGrid, sortLayout } from 'webkit/ui/SnapGrid/layout'
  import { getDashboardEditor$Ctx } from './ctx'

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  $: ({ widgets } = $dashboardEditor$)
  $: layout = generateLayout(widgets)

  function generateLayout(widgets: any[]) {
    const layout = widgets.map((_, i) => [0, 1000 + i, 6, 2])
    // @ts-ignore
    normalizeGrid(sortLayout(layout))
    return layout
  }
</script>

<!-- @ts-ignore -->
<Grid tag="widgets" {layout} let:i let:gridItem rowSize={26}>
  {@const widget = widgets[i]}

  <widget use:gridItem class="column">
    {#if widget.type === 'TEXT'}
      <TextWidget {widget} />
    {:else if widget.type === 'HEADING'}
      <HeadingWidget {widget} />
    {/if}

    <Resizer onEnd={console.log} />
  </widget>
</Grid>

<style>
  widget > :global(*) {
    height: 100%;
  }
</style>
