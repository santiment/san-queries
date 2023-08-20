<script lang="ts">
  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import Resizer from 'webkit/ui/SnapGrid/Resizer.svelte'
  import TextWidget from './TextWidget/index.svelte'
  import HeadingWidget from './HeadingWidget/index.svelte'
  import QueryWidget from './QueryWidget/index.svelte'
  import { getDashboardEditor$Ctx } from './ctx'

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  const cols = 12

  $: ({ widgets, layout } = $dashboardEditor$)

  function hook(node: HTMLElement, widget: App.Dashboard.Widget) {
    widget.htmlNode = node
  }
</script>

<Grid
  tag="widgets"
  {cols}
  {layout}
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
    {/if}

    <Resizer onEnd={() => console.log(widget, layout)} />
  </widget>
</Grid>

<style>
  widget > :global(*) {
    height: 100%;
  }
</style>
