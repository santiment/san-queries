<script lang="ts">
  import type { TableColumn } from '../Table.svelte'

  import Control from '../Control.svelte'

  export let columns: TableColumn[]
  export let controls = {} as { props: any; sort: { column: any; dir: 'asc' | 'desc' } }

  const DIRECTIONS = [
    { name: 'Descending', value: 'desc' },
    { name: 'Ascending', value: 'asc' },
  ]
  const DirToOption = { desc: DIRECTIONS[0], asc: DIRECTIONS[1] }

  controls.props = { onSortClick }

  $: sortableColumns = columns.filter((column) => !!column.sortAccessor)

  function onSortClick(column: any, _, dir: 'asc' | 'desc') {
    controls.sort.column = column
    controls.sort.dir = dir
  }
</script>

<Control
  name="Sorted column"
  options={sortableColumns}
  value={controls.sort.column}
  defaultValue="Default"
  onUpdate={(option) => {
    controls.sort.column = option
    controls = controls
  }}
  let:option
>
  {option.title}
</Control>

<Control
  name="Sort direction"
  options={DIRECTIONS}
  value={DirToOption[controls.sort.dir || 'desc']}
  onUpdate={(option) => {
    controls.sort.dir = option.value
    controls = controls
  }}
  let:option
>
  {option.name}
</Control>

<style>
</style>
