<script>import Field from 'san-webkit/lib/ui/Field/Select.svelte';
export let panel;
export let columns;

$: selected = selected || columns[0];

function onSelect(column) {
  panel.textValueColumn = column;
}

const format = ({
  id,
  title
}) => `Column ${id}: ${title}`;</script>

<Field bind:selected title="Text value column" options={columns} class="mrg-xl mrg--b" {onSelect}>
  {format(selected)}
  <svelte:fragment slot="option" let:option>{format(option)}</svelte:fragment>
</Field>
