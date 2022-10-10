<script>
  import Table from 'webkit/ui/Table/Paged.svelte'

  let className = ''
  export { className as class }
  export let columns = []
  export let data
</script>

<Table items={data} {columns} class="$style.table {className}" sticky />

<style lang="scss">
  .table {
    overflow: auto;
    flex: 1;

    &:global {
      th {
        padding: 0 15px !important;
      }

      td {
        border-bottom: 1px solid var(--porcelain);
        // padding: 10px 25px;
        white-space: pre !important;
      }
    }
  }
</style>
