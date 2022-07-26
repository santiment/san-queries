<script>
  import Field from 'webkit/ui/Field/Select.svelte'
  import { Formatter, options } from './format'

  export let i
  export let column

  $: selected = Formatter[column.formatterId || 0]

  function onSelect({ id, fn }) {
    column.format = fn ? (data) => fn(column.accessor(data)) : column.accessor
    column.formatter = fn
    column.formatterId = id
  }
</script>

<Field title={`Column ${i}: Format`} bind:selected {options} {onSelect} class="mrg-xl mrg--b">
  {selected.title}

  <svelte:fragment slot="option" let:option>
    {option.title}
  </svelte:fragment>
</Field>
