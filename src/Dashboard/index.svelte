<script lang="ts">
  import { normalizeGrid, sortLayout } from 'webkit/ui/SnapGrid/layout'
  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import Panel from './Panel.svelte'
  import { getAppContext } from '@/context'

  const { dashboard$ } = getAppContext()

  export let dashboard
  export let selectedPanel

  let isOpened = false
  let isDragging = false

  $: ({ panels } = dashboard)
  $: console.log(panels, dashboard)
  $: isSinglePanel = panels.length === 1
  $: layout = buildLayout(panels)

  function onPanelDelete(panel) {
    panels = panels.filter((v) => v !== panel)
    dashboard.panels = panels
    if (panel.id) dashboard.removedPanels.push(panel)
    dashboard$.set(dashboard)
  }

  function onPanelSelect(panel) {
    if (isDragging) return
    selectedPanel = panel
    window.__selectSidebarPanel(panel)
  }

  function buildLayout(panels: SAN.Queries.Panel[]) {
    const layout = panels.map((panel, i) => {
      const item = panel.settings.layout?.slice() || [0, 1000 + i, 6, 3]
      panel.settings.layout = item

      return item
    })

    normalizeGrid(sortLayout(layout), new Set())

    return layout
  }

  function onLayoutChange() {
    dashboard$.set($dashboard$)
  }
</script>

<Grid
  tag="section"
  {layout}
  {onLayoutChange}
  cols={6}
  rowSize={100}
  minCols={2}
  minRows={2}
  bind:isDragging
  let:class={className}
  let:i
  let:onMouseDown
  let:style>
  {@const panel = panels[i]}

  <Panel
    {dashboard}
    {panel}
    {style}
    class={className}
    onDelete={isSinglePanel ? null : () => onPanelDelete(panel)}
    onDrag={onMouseDown}
    onResizeEnd={onLayoutChange}
    on:click={() => onPanelSelect(panel)} />
</Grid>

<style>
  /* TODO: remove */
  :global(body) {
    overflow-y: scroll;
  }
</style>
