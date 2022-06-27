<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import Table from 'webkit/ui/Table/svelte'

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

  const items = [
    { id: 0, value: 300, volume: 2000 },
    { id: 1, value: 100, volume: 4000 },
    { id: 2, value: 800, volume: 90 },
    { id: 3, value: 50, volume: 1000 },
    { id: 4, value: 2000, volume: 30 },
    { id: 5, value: 150, volume: 5000 },
  ]
</script>

<Table {items} {columns} keyProp="id" class="$style.table" />

<div class="paged row v-center mrg-l mrg--t">
  <Tooltip on="click" position="top">
    <div slot="trigger" class="btn-2 btn--s mrg-s mrg--r">
      10 rows <Svg id="arrow-down" w="8" h="5" class="mrg-m mrg--l" />
    </div>

    <div slot="tooltip" class="pages column">
      <button class="btn-ghost">10 rows</button>
      <button class="btn-ghost">25 rows</button>
      <button class="btn-ghost">50 rows</button>
    </div>
  </Tooltip>

  <span class="c-waterloo">Page</span>

  <input type="number" class="input txt-center mrg-l mrg--l mrg--r" min="1" value="1" />

  <span class="c-waterloo">of 56</span>

  <div class="btn-2 btn--s row hv-center mrg-a mrg--l">
    Prev
    <Svg id="arrow-left" w="5" h="8" class="mrg-m mrg--l" />
  </div>
  <div class="btn-2 btn--s row hv-center mrg-s mrg--l">
    <Svg id="arrow-right" w="5" h="8" class="mrg-m mrg--r" />
    Next
  </div>
</div>

<style lang="scss">
  .table {
    width: calc(100% + 32px) !important;
    border-top: 1px solid var(--porcelain);
    margin: 16px -16px 0;

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

  .paged {
    --fill: var(--waterloo);
  }

  .pages {
    padding: 8px;
  }

  input {
    width: 45px;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
</style>
