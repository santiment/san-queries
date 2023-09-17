<script lang="ts">
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Control from './Control.svelte'
  import Table from './Table.svelte'
  import Chart from './Chart/index.svelte'
  import ControlsSection from './ControlsSection.svelte'

  export let sqlData = { headers: [], rows: [], types: [] } as App.SqlData

  let controls = {
    visualisation: 'Table',
  }

  let ColumnSettings = {} as Record<string, Partial<{ title: string }>>

  $: if (process.browser) {
    getData()
  }

  function getData() {
    queryComputeRawClickhouseQuery().then((data) => {
      sqlData = data
    })
  }
</script>

<main class="row gap-l">
  <section class="column visualisation">
    {#if controls.visualisation === 'Table'}
      <Table {sqlData} {ColumnSettings} />
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
        <Control
          name="Sorted column"
          options={['None', 'Table', 'Chart']}
          value={'None'}
          onUpdate={(updated) => {
            // controls.visualisation = updated
            controls = controls
          }}
        />

        <Control
          name="Sort direction"
          options={['Ascending', 'Descending']}
          value={'Ascending'}
          onUpdate={(updated) => {
            // controls.visualisation = updated
            controls = controls
          }}
        />
      {:else}
        <Control
          name="X axis column"
          options={['Default']}
          value={'Default'}
          onUpdate={(updated) => {
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
          value={'No formatting'}
          onUpdate={(updated) => {
            // ColumnSettings[column] = { ...ColumnSettings[column] }
            // ColumnSettings[column].title = updated.trim()
          }}
        />

        {#if controls.visualisation === 'Chart'}
          <Control
            name="Chart style"
            options={['Line', 'Bars']}
            value={'Line'}
            onUpdate={(updated) => {
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
  }

  Table {
    overflow: auto;
  }
</style>
