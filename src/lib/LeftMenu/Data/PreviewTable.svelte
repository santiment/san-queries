<script lang="ts">
  import Table from '$lib/QueryEditor/Visualisation/Table.svelte'
  import { queryComputeRawClickhouseQuery } from '$lib/api/query'

  export let table: string

  let sqlData

  $: if (process.browser) {
    if (table)
      queryComputeRawClickhouseQuery({ sql: `SELECT * FROM ${table} LIMIT 5` }).then((data) => {
        sqlData = data
      })
  }
</script>

{#if sqlData}
  <Table {sqlData} />
{:else}
  <div class="loading-spin" />
{/if}

<style>
  Table {
    height: 100%;
  }

  .loading-spin {
    position: absolute;
    left: 50%;
    top: 50%;
  }
</style>
