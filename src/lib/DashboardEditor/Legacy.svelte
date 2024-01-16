<script lang="ts">
  import type { SnapItem } from 'webkit/ui/SnapGrid/types'

  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import { normalizeGrid, sortLayout } from 'webkit/ui/SnapGrid/layout'
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import Chart from '$lib/QueryEditor/Visualisation/Chart/index.svelte'
  import { Formatter } from '$lib/QueryEditor/Visualisation/Controls/FormattingControl.svelte'
  import { queryLegacyDashboardCache } from '$lib/api/dashboard/legacy'

  export let dashboard: App.ApiDashboard

  let panelsData = {} as Record<string, App.SqlData>

  $: panels = dashboard.panels!
  $: layout = getLayout(panels)
  $: ColumnsSettings = getColumnsSettings(panels)

  $: if (panels) getPanelsData()
  $: console.log(dashboard)

  async function getPanelsData() {
    panelsData = {}

    try {
      const cache = await queryLegacyDashboardCache(dashboard.id)

      cache.forEach((cache: any) => {
        panelsData[cache.id] = cache
      })

      panelsData = panelsData
    } catch (e) {
      console.error(e)
    }

    panels.forEach((panel) => {
      if (panelsData[panel.id]) return

      queryComputeRawClickhouseQuery({
        sql: panel.sql.query,
        parameters: JSON.stringify(panel.sql.parameters || ''),
      }).then((data) => {
        panelsData[panel.id] = data
        panelsData = panelsData
      })
    })
  }

  function getLayout(panels: App.LegacyPanel[]) {
    const layout = panels.map((panel) => {
      const { layout } = panel.settings || {}
      return (layout || [0, 1000, 6, 5]) as any as SnapItem
    })

    normalizeGrid(sortLayout(layout))

    return layout
  }

  function getColumnsSettings(panels: App.LegacyPanel[]) {
    return panels.map((panel: any) => {
      if (!panel.settings) return []

      const { columns } = panel.settings
      if (!columns) return []

      return columns.map((column: any) => {
        const settings = {} as Record<string, any>

        if (column.title) settings.title = column.title
        if (column.formatterId) settings.formatter = (Formatter as any)[column.formatterId]

        return settings
      })
    })
  }

  function mapColumnSettingsToData(ColumnSettings: any[], sqlData: App.SqlData) {
    const settings = {} as any

    ColumnSettings.forEach((columnSettings, i) => {
      settings[sqlData.headers[i]] = columnSettings
    })

    return settings
  }

  function mapTextWidget(widget: any) {
    widget.value = `# ${widget.name}

      ${widget.settings?.columns?.[0]?.title}`

    return widget
  }

  import TextWidget from '$lib/DashboardEditor/TextWidget/index.svelte'
  import ControlsSection from '$lib/QueryEditor/Visualisation/ControlsSection.svelte'
</script>

<Grid tag="widgets" cols={6} {layout} let:i let:gridItem rowSize={100} minCols={3} readonly>
  {@const widget = panels[i]}

  {#if widget.settings?.type === 'TEXT'}
    <widget use:gridItem class="column text">
      <TextWidget readonly widget={mapTextWidget(widget)} />
    </widget>
  {:else}
    <widget use:gridItem class="column border">
      <header class="row v-center fluid gap-s">
        <h2 class="body-2">{widget.name}</h2>
      </header>

      {#if panelsData[widget.id]}
        {@const sqlData = panelsData[widget.id]}

        {#if widget.settings?.type === 'CHART'}
          <Chart
            {sqlData}
            ColumnSettings={mapColumnSettingsToData(ColumnsSettings[i], sqlData)}
            metricsClass="$style.metrics"
          />
        {:else}
          <Table
            border={false}
            {sqlData}
            ColumnSettings={mapColumnSettingsToData(ColumnsSettings[i], sqlData)}
          />
        {/if}
      {/if}
    </widget>
  {/if}
</Grid>

<legacy-caption class="row hv-center c-red">
  This is a legacy dashboard. Save it to migrate the dashboard to Queries V2
</legacy-caption>

<style>
  legacy-caption {
    position: fixed;
    left: 300px;
    bottom: 0;
    right: 0;

    background: var(--red-light-1);
    padding: 6px 24px;
  }

  header {
    padding: 12px 18px 12px 12px;
    border-bottom: 1px solid var(--porcelain);
  }

  Table {
    max-height: calc(100% - 57px);
  }

  .text {
    pointer-events: none;
  }

  widget > :global(text-widget) {
    flex: 1;
  }

  .metrics {
    padding: 8px 8px 0;
  }
</style>
