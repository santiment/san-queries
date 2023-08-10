<script lang="ts">
  import Table from 'webkit/ui/Table/Paged.svelte'

  let className = ''
  export { className as class }
  export let columns = [] as any[]
  export let data = [] as any[]
</script>

<table-widget class="column border">
  <Table items={data} {columns} class={className} sticky />
</table-widget>

<style lang="scss">
  table-widget {
    flex: 1;

    :global(.paged) {
      padding: 16px;
      margin: 0;
    }
  }

  Table {
    overflow: auto;
    flex: 1;

    :global {
      // th {
      //   padding: 0 15px !important;
      // }

      td {
        border-bottom: 1px solid var(--porcelain);
        white-space: pre !important;
      }
    }
  }
</style>
