<script lang="ts">
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Control from './Control.svelte'
  import Table from './Table.svelte'
  import Chart from './Chart/index.svelte'
  import ControlsSection from './ControlsSection.svelte'

  export let sqlData = { headers: [], rows: [], types: [] } as {
    headers: string[]
    rows: (string | number | null)[][]
    types: string[]
  }

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
    </ControlsSection>

    {#each sqlData.headers as column, i}
      {@const settings = ColumnSettings[column] || {}}
      <ControlsSection title="Column {i}: {column}" isOpened={false}>
        <Control
          name="Title"
          value={settings.title}
          placeholder={column}
          onUpdate={(updated) => {
            ColumnSettings[column] = { ...ColumnSettings[column] }
            ColumnSettings[column].title = updated.trim()
          }}
        />
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
