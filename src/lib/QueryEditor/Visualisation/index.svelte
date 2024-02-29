<script lang="ts">
  import SpinLoader from 'webkit/ui/SpinLoader.svelte'
  import { getQueryEditor$Ctx } from '$routes/(editor)/query/ctx'
  import Control from './Control.svelte'
  import Table, { getTableColumns } from './Table.svelte'
  import TableControls from './Table/Controls.svelte'
  import Chart, { getChartColumns } from './Chart/index.svelte'
  import ControlsSection from './ControlsSection.svelte'
  import FormattingControl from './Controls/FormattingControl.svelte'
  import NoData from './NoData.svelte'
  import { EventAutoSave$ } from '$routes/(editor)/query/events'

  const { queryEditor$ } = getQueryEditor$Ctx()

  let controls = {
    sort: {} as any,
    props: {} as any,
  }

  let loading = false

  $: queryEditor = $queryEditor$
  $: ({ sqlData, settings } = queryEditor)
  $: tableColumns = getTableColumns(sqlData, settings.columns)
  $: chartColumns = getChartColumns(sqlData, settings.columns)

  function updateSettings(value: any) {
    queryEditor$.updateSettings(value)

    EventAutoSave$.dispatch()
  }

  function updateColumnSettings(column: string, value: any) {
    queryEditor$.updateColumnSettings(column, value)

    EventAutoSave$.dispatch()
  }
</script>

<main class="row gap-l relative" class:data-loading={loading}>
  {#if loading}
    <SpinLoader />
  {/if}
  <section class="column visualisation relative">
    {#if settings.visualisation === 'Table'}
      <Table
        {...controls.props}
        columns={tableColumns}
        {sqlData}
        ColumnSettings={settings.columns}
        sort={controls.sort}
      />
    {:else}
      <Chart class="" {sqlData} ColumnSettings={settings.columns} columns={chartColumns} />
    {/if}

    {#if sqlData.rows.length === 0}
      <NoData />
    {/if}
  </section>

  <options class="column gap-l">
    <ControlsSection title="Visualisation: {settings.visualisation}">
      <Control
        name="Visualization type"
        options={['Table', 'Chart']}
        value={settings.visualisation}
        onUpdate={(updated) => {
          updateSettings({ visualisation: updated })
        }}
      />

      {#if settings.visualisation === 'Table'}
        <TableControls columns={tableColumns} bind:controls />
      {:else}
        <!--
        <Control
          name="X axis column"
          options={['Default']}
          value={'Default'}
          onUpdate={(_updated) => {
            // controls.visualisation = updated
            controls = controls
          }}
        />
-->
      {/if}
    </ControlsSection>

    {#each sqlData.headers as column, i}
      {@const columnSettings = settings.columns[column] || {}}

      <ControlsSection title="Column {i}: {column}">
        <Control
          name="Title"
          value={columnSettings.title}
          defaultValue={column}
          placeholder={column}
          onUpdate={(updated) => {
            updateColumnSettings(column, { title: updated.trim() })
          }}
        />

        <FormattingControl
          {column}
          settings={columnSettings}
          type={sqlData.types[i]}
          update={updateColumnSettings}
        />

        {#if settings.visualisation === 'Chart' && i.toString() !== chartColumns.dateColumn}
          <Control
            name="Chart style"
            options={['Line', 'Bars', 'Area']}
            value={columnSettings.chartNode || 'Line'}
            onUpdate={(updated) => {
              updateColumnSettings(column, { chartNode: updated })
            }}
          />

          <Control
            checkbox
            name="Displayed on chart"
            value={!columnSettings.isHiddenOnChart}
            onUpdate={(updated) => {
              updateColumnSettings(column, { isHiddenOnChart: !updated })
            }}
          />
        {/if}
      </ControlsSection>
    {/each}
  </options>
</main>

<style>
  main {
    background: var(--white);
    border-radius: 6px;
    flex: 1;
    padding: 16px 24px;
    min-height: 0;
  }

  .data-loading {
    opacity: 0.5;
  }

  options {
    max-width: 320px;
    min-width: 320px;
    overflow: auto;
  }

  .visualisation {
    flex: 1;
    min-width: 0;
  }

  Table {
    overflow: auto;
  }
</style>
