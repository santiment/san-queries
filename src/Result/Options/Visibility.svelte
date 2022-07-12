<script>
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import Field from '@/Field.svelte'

  export let i
  export let column

  $: isActive = !column.isHidden

  function onClick() {
    column.isHidden = isActive
  }
</script>

<Field title={`Column ${i}: Visibility`} let:classes>
  <button class="btn-ghost row v-center {classes}" on:click={onClick}>
    <Checkbox class="mrg-s mrg--r" {isActive} />
    Is visible</button>
</Field>
