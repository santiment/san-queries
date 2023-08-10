<script lang="ts">
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Control from './Control.svelte'
  import Table from './Table.svelte'

  let value = 'Table'

  let table = {
    columns: [] as {
      key: string
      title: string
      valueKey: number
      format: (row: [], i: number, value: any) => any
    }[],
    data: [] as (string | number | null)[][],
  }

  let sqlData = { headers: [], rows: [], types: [] } as {
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

  $: table.columns = sqlData.headers.map((key, i) => {
    const settings = ColumnSettings[key] || {}

    return {
      key,
      title: settings.title || key,
      valueKey: i,
      format: (row: any, i: number, value: any) => value,
    }
  })

  $: table.data = sqlData.rows

  function getData() {
    queryComputeRawClickhouseQuery().then((data) => {
      sqlData = data
      table = table
    })
  }
</script>

<main class="row gap-m">
  <Table {...table} />

  <section class="options border column">
    <h2 class="body-2">Options</h2>

    <controls class="column gap-xl">
      <Control
        name="Visualization type"
        options={['Table', 'Chart']}
        {value}
        onUpdate={(updated) => {
          controls.visualisation = updated
          controls = controls
        }}
      />

      {#each sqlData.headers as column, i}
        {@const settings = ColumnSettings[column] || {}}

        <Control
          name="Column {i}: Title - {column}"
          value={settings.title}
          placeholder={column}
          onUpdate={(updated) => {
            ColumnSettings[column] = { ...ColumnSettings[column] }
            ColumnSettings[column].title = updated.trim()
          }}
        />
      {/each}
    </controls>
  </section>
</main>

<style>
  main {
    background: var(--white);
    border-radius: 6px;
    flex: 1;
    padding: 16px 24px;
  }

  .options {
    max-width: 280px;
    flex: 1;
  }

  h2 {
    padding: 16px;
    border-bottom: 1px solid var(--porcelain);
  }

  controls {
    padding: 24px 16px;
    overflow: auto;
    flex: 1;
  }
</style>
