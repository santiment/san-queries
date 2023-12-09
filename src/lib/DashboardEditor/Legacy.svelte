<script lang="ts">
  import type { SnapItem } from 'webkit/ui/SnapGrid/types'

  import Grid from 'webkit/ui/SnapGrid/Grid.svelte'
  import { normalizeGrid, sortLayout } from 'webkit/ui/SnapGrid/layout'
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import { Formatter } from '$lib/QueryEditor/Visualisation/Controls/FormattingControl.svelte'

  export let dashboard: App.ApiDashboard

  let panelsData = [] as App.SqlData[]

  $: panels = dashboard.panels as App.LegacyPanel[]
  $: layout = getLayout(panels)
  $: ColumnsSettings = getColumnsSettings(panels)

  $: console.log(layout, panels, panelsData)

  $: if (panels) getPanelsData()

  function getPanelsData() {
    panelsData = []

    panels.forEach((panel, i) => {
      queryComputeRawClickhouseQuery({ sql: panel.sql.query }).then((data) => {
        panelsData[i] = data
        panelsData = panelsData
      })
    })
  }

  function getLayout(panels: App.LegacyPanel[]) {
    const layout = panels.map((panel) => {
      const { layout } = panel.settings || {}
      return (layout || [0, 1000, 12, 5]) as any as SnapItem
    })

    normalizeGrid(sortLayout(layout))

    return layout
  }

  function getColumnsSettings(panels: App.LegacyPanel[]) {
    return panels.map((panel: any) => {
      if (!panel.settings) return

      const { columns } = panel.settings
      if (!columns) return

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
</script>

<Grid tag="widgets" cols={6} {layout} let:i let:gridItem rowSize={100} minCols={3} readonly>
  {@const widget = panels[i]}
  <widget use:gridItem class="column border">
    <header class="row v-center fluid gap-s">
      <h2 class="body-2">{widget.name}</h2>
    </header>

    {#if panelsData[i]}
      {@const sqlData = panelsData[i]}

      <Table
        border={false}
        {sqlData}
        ColumnSettings={mapColumnSettingsToData(ColumnsSettings[i], sqlData)}
      />
    {/if}
  </widget>
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
</style>
