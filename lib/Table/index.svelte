<script>import Table from 'san-webkit/lib/ui/Table/Paged.svelte';
let className = '';
export { className as class };
export let columns = [];
export let data;</script>

<Table items={data} {columns} class="table-24vALn {className}" sticky />

<style lang="scss">:global(.table-24vALn) {
  overflow: auto;
  flex: 1;
}
:global(.table-24vALn) :global(th) {
  padding: 0 15px !important;
}
:global(.table-24vALn) :global(td) {
  border-bottom: 1px solid var(--porcelain);
  white-space: pre !important;
}</style>
