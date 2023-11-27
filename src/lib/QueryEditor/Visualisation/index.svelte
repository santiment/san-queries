<script lang="ts">
  import SpinLoader from 'webkit/ui/SpinLoader.svelte'
  import { getQueryEditor$Ctx } from '$routes/(editor)/query/ctx'
  import Control from './Control.svelte'
  import Table, { getTableColumns } from './Table.svelte'
  import TableControls from './Table/Controls.svelte'
  import Chart from './Chart/index.svelte'
  import ControlsSection from './ControlsSection.svelte'
  import FormattingControl from './Controls/FormattingControl.svelte'
  import NoData from './NoData.svelte'

  const { queryEditor$ } = getQueryEditor$Ctx()

  let controls = {
    visualisation: 'Table',
    sort: {} as any,
    props: {} as any,
  }

  let ColumnSettings = {} as Record<string, Partial<{ title: string }>>
  let loading = false

  $: queryEditor = $queryEditor$
  $: ({ sqlData, settings } = queryEditor)
  $: tableColumns = getTableColumns(sqlData, settings.columns)

  function updateColumnSettings(column: string, value: any) {
    queryEditor$.updateSettings(column, value)
  }
</script>

<main class="row gap-l relative" class:data-loading={loading}>
  {#if loading}
    <SpinLoader />
  {/if}
  <section class="column visualisation relative">
    {#if controls.visualisation === 'Table'}
      <Table
        {...controls.props}
        columns={tableColumns}
        {sqlData}
        ColumnSettings={settings.columns}
        sort={controls.sort}
      />
    {:else}
      <Chart class="border" {sqlData} {ColumnSettings} />
    {/if}

    {#if sqlData.rows.length === 0}
      <NoData />
    {/if}
  </section>

  <options class="column gap-l">
    <ControlsSection title="Visualisation: {controls.visualisation}">
      <Control
        name="Visualization type"
        options={['Table', 'Chart']}
        value={controls.visualisation}
        onUpdate={(updated) => {
          controls.visualisation = updated
          controls = controls
        }}
      />

      {#if controls.visualisation === 'Table'}
        <TableControls columns={tableColumns} bind:controls />
      {:else}
        <Control
          name="X axis column"
          options={['Default']}
          value={'Default'}
          onUpdate={(_updated) => {
            // controls.visualisation = updated
            controls = controls
          }}
        />
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
            queryEditor$.updateSettings(column, { title: updated.trim() })
          }}
        />

        <FormattingControl
          {column}
          settings={columnSettings}
          type={sqlData.types[i]}
          update={updateColumnSettings}
        />

        {#if controls.visualisation === 'Chart'}
          <Control
            name="Chart style"
            options={['Line', 'Bars']}
            value={'Line'}
            onUpdate={(_updated) => {
              // controls.visualisation = updated
              // controls = controls
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
