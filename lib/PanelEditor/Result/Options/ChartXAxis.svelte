<script>import Field from 'san-webkit/lib/ui/Field/Select.svelte';
export let panel;
export let columns;
export let dateColumns;

$: selected = selected || columns[[...dateColumns][0] || 0];

$: options = columns.filter(({
  id
}) => dateColumns.has(id));

function onSelect(column) {
  panel.xAxis = column;
  panel.xAxisKey = column.id;
}

const format = ({
  id,
  title
}) => `Column ${id}: ${title}`;</script>

<Field bind:selected title="Chart X-axis column" {options} class="mrg-xl mrg--b" {onSelect}>
  {format(selected)}
  <svelte:fragment slot="option" let:option>{format(option)}</svelte:fragment>
</Field>
