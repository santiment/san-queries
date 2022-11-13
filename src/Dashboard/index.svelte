<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { notifications$ } from 'webkit/ui/Notifications'
  import { normalizeGrid, sortLayout } from 'webkit/ui/SnapGrid/layout'
  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import { PanelType } from '@/types'
  import { newPanel } from '@/stores/dashboard'
  import Panel from './Panel.svelte'
  import { mutateComputeRawClickhouseQuery } from '@/api/rawQuery'
  import { getParametersMap } from '@/utils/parameters'
  import { Formatter, FormatType } from '@/PanelEditor/Result/Options/format'

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
  }

  function onGetDataClick() {
    panels.forEach((panel) => {
      const { query, parameters } = panel.sql

      return mutateComputeRawClickhouseQuery(query, getParametersMap(parameters))
        .then((data) => {
          const { rows, headers, dateColumns } = data

          panel.__rows = rows
          panel.__computedSql = data
          panel.settings.columns = headers.map((title, i) => newColumn(title, i, dateColumns))

          panels = panels
        })
        .catch(() => {
          notifications$.show({
            title: 'Error during data load',
            type: 'error',
          })
        })
    })
  }

  // TODO: refactor. Move to utils. Same for PanelEditor/Result/index.svelte
  function newColumn(title, i, dateColumns) {
    const accessor = (data) => data[i]

    const column = {
      id: i,
      title,
      accessor,
      format: accessor,
      sortAccessor: accessor,
    }

    if (dateColumns.has(i)) {
      const { id, fn } = Formatter[FormatType.DATE]
      column.format = (data) => fn(accessor(data))
      column.formatter = fn
      column.formatterId = id
      column.sortAccessor = (data) => Date.parse(data[i])
    }

    return column
  }

  function onPanelSelect(panel) {
    if (isDragging) return
    selectedPanel = panel
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
</script>

<Grid
  tag="section"
  {layout}
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
    {panel}
    {style}
    class={className}
    onDelete={isSinglePanel ? null : () => onPanelDelete(panel)}
    onDrag={onMouseDown}
    on:click={() => onPanelSelect(panel)} />
</Grid>

<style>
  /* TODO: remove */
  :global(body) {
    overflow-y: scroll;
  }
</style>
