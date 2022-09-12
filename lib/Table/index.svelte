<script>import Table from 'san-webkit/lib/ui/Table/Paged.svelte';
export let columns = [];
export let data;</script>

<Table items={data} {columns} class="table-j2k9wz" sticky />

<style lang="scss">:global(.table-j2k9wz) {
  width: calc(100% + 32px) !important;
  border-top: 1px solid var(--porcelain);
  margin: 16px -16px 0;
  overflow: auto;
  flex: 1;
}
:global(.table-j2k9wz) :global(th) {
  padding: 0 15px !important;
}
:global(.table-j2k9wz) :global(td) {
  border-bottom: 1px solid var(--porcelain);
  white-space: pre !important;
}</style>
