<script>
  import Table from 'webkit/ui/Table/Paged.svelte'

  const columns = [
    {
      title: 'Price',
      format: ({ value }) => '$' + value,
      sortAccessor: ({ value }) => value,
    },
    {
      title: 'Tokens',
      format: ({ volume }) => volume + ' VOL',
      sortAccessor: ({ volume }) => volume,
    },
  ]

  const ITEMS = [
    { value: 300, volume: 2000 },
    { value: 100, volume: 4000 },
    { value: 800, volume: 90 },
    { value: 50, volume: 1000 },
    { value: 2000, volume: 30 },
    { value: 150, volume: 5000 },
  ]

  const items = ITEMS.concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .concat(ITEMS)
    .map((v, i) => {
      v.id = i
      return { ...v }
    })
</script>

<Table {items} {columns} keyProp="id" class="$style.table" sticky />

<style lang="scss">
  .table {
    width: calc(100% + 32px) !important;
    border-top: 1px solid var(--porcelain);
    margin: 16px -16px 0;
    max-height: 392px;
    overflow: auto;

    &:global {
      th {
        padding: 0 15px !important;
      }

      td {
        border-bottom: 1px solid var(--porcelain);
        padding: 10px 25px;
      }
    }
  }
</style>
