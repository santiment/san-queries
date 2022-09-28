<script>import Table from 'san-webkit/lib/ui/Table/Paged.svelte';
export let columns = [];
export let data;</script>

<Table items={data} {columns} class="table-klMEA0" sticky />

<style lang="scss">:global(.table-klMEA0) {
  width: calc(100% + 32px) !important;
  border-top: 1px solid var(--porcelain);
  margin: 16px -16px 0;
  overflow: auto;
  flex: 1;
}
:global(.table-klMEA0) :global(th) {
  padding: 0 15px !important;
}
:global(.table-klMEA0) :global(td) {
  border-bottom: 1px solid var(--porcelain);
  white-space: pre !important;
}</style>
