<script lang="ts">
  import Field from 'webkit/ui/Field/Select.svelte'

  export let columns
  export let visualization
  export let dateColumns

  $: selected = selected || columns[[...dateColumns][0] || 0]
  $: options = columns.filter(({ id }) => dateColumns.has(id))

  function onSelect(column) {
    visualization.xAxis = column
    visualization.xAxisKey = column.id
    console.log(visualization)
  }

  const format = ({ id, title }) => `Column ${id}: ${title}`
</script>

<Field bind:selected title="Chart X-axis column" {options} class="mrg-xl mrg--b" {onSelect}>
  {format(selected)}
  <svelte:fragment slot="option" let:option>{format(option)}</svelte:fragment>
</Field>
