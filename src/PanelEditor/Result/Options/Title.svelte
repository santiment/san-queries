<script>
  import Field from 'webkit/ui/Field/svelte'

  export let i
  export let column
  export let headers
</script>

<Field
  title={`Column ${i}: Title - ${headers[i]}`}
  placeholder={headers[i]}
  bind:value={column.title} />
