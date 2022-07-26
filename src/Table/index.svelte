<script>
  import Table from 'webkit/ui/Table/Paged.svelte'

  export let columns = []
  export let data
</script>

<Table items={data} {columns} class="$style.table" sticky />

<style lang="scss">
  .table {
    width: calc(100% + 32px) !important;
    border-top: 1px solid var(--porcelain);
    margin: 16px -16px 0;
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
