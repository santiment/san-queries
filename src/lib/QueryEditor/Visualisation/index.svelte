<script lang="ts">
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'
  import Control from './Control.svelte'
  import Table from './Table.svelte'

  let value = 'Table'

  let table = {
    columns: [] as {
      title: string
      valueKey: number
      format: (row: [], i: number, value: any) => any
    }[],
    data: [] as (string | number | null)[][],
  }

  $: if (process.browser) {
    getData()
  }

  function getData() {
    queryComputeRawClickhouseQuery().then((data) => {
      table.columns = data.headers.map((title, i) => {
        return {
          title: title,
          valueKey: i,
          format: (row: any, i: number, value: any) => value,
        }
      })

      table.data = data.rows

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
        onUpdate={(updated) => (value = updated)}
      />
      <Control name="Column 0: Title" />
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
