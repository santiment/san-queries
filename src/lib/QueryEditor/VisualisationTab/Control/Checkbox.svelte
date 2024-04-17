<script lang="ts">
  import Field from '$lib/ui/Field/Field.svelte'
  import Checkbox from '$lib/ui/Checkbox'

  let {
    name,
    column,
    value = false,
    onChange,
  }: {
    name: string
    column: string
    value?: boolean
    onChange: (value: boolean) => void
  } = $props()

  let id = $derived(`${column}_${name}`)
</script>

<Field name="Displayed on chart" for={id}>
  <label class="flex cursor-pointer items-center gap-2" for={id}>
    <Checkbox {id} {value} {onChange}></Checkbox> Is visible
  </label>
</Field>
