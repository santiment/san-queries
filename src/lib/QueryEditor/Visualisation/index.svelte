<script lang="ts">
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Control from './Control.svelte'
  import Table, { getTableColumns } from './Table.svelte'
  import TableControls from './Table/Controls.svelte'
  import Chart from './Chart/index.svelte'
  import ControlsSection from './ControlsSection.svelte'

  export let sql = ''
  export let sqlData = { headers: [], rows: [], types: [] } as App.SqlData

  let controls = {
    visualisation: 'Table',
    sort: {} as any,
    props: {} as any,
  }

  let ColumnSettings = {} as Record<string, Partial<{ title: string }>>

  $: console.log(controls)
  $: tableColumns = getTableColumns(sqlData, ColumnSettings)

  $: if (process.browser) {
    getData()
  }

  function getData() {
    queryComputeRawClickhouseQuery({ sql }).then((data) => {
      sqlData = data
    })
  }
</script>

<main class="row gap-l">
  <section class="column visualisation">
    {#if controls.visualisation === 'Table'}
      <Table
        {...controls.props}
        columns={tableColumns}
        {sqlData}
        {ColumnSettings}
        sort={controls.sort}
      />
    {:else}
      <Chart class="border" {sqlData} {ColumnSettings} />
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
      {@const settings = ColumnSettings[column] || {}}

      <ControlsSection title="Column {i}: {column}">
        <Control
          name="Title"
          value={settings.title}
          placeholder={column}
          onUpdate={(updated) => {
            ColumnSettings[column] = { ...ColumnSettings[column] }
            ColumnSettings[column].title = updated.trim()
          }}
        />

        <Control
          name="Format"
          options={['No formatting']}
          value={null}
          defaultValue={'No formatting'}
          onUpdate={(_updated) => {
            // ColumnSettings[column] = { ...ColumnSettings[column] }
            // ColumnSettings[column].title = updated.trim()
          }}
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
    max-height: 100vh;
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
