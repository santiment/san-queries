<script>import Table from 'san-webkit/lib/ui/Table/Paged.svelte';
let className = '';
export { className as class };
export let columns = [];
export let data;</script>

<div class="table-wrapper">
<Table items={data} {columns} class="table-0u8qjM {className}" sticky />
</div>

<style >
.table-wrapper {
  overflow: auto;
  min-width: 0;
}

:global(.table-0u8qjM) {
  overflow: auto;
  flex: 1;
}
:global(.table-0u8qjM) :global(th) {
  padding: 0 15px !important;
}
:global(.table-0u8qjM) :global(td) {
  border-bottom: 1px solid var(--porcelain);
  white-space: pre !important;
}

:global(.table-0u8qjM) + :global(.paged) {
        position: sticky;
        bottom: 0;
        left: 0;
        background: var(--white);
        z-index: 2;
      }
</style>
