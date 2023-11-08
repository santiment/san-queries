<script>
  import Table from 'webkit/ui/Table/Paged.svelte'

  let className = ''
  export { className as class }
  export let columns = []
  export let data
</script>

<div class="wrapper">
<Table items={data} {columns} class="$style.table {className}" sticky />
</div>

<style lang="scss">
.wrapper {
  overflow: auto;
  min-width: 0;
}

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

      + .paged {
        position: sticky;
        bottom: 0;
        left: 0;
        background: var(--white);
        z-index: 2;
      }
    }
  }
</style>
