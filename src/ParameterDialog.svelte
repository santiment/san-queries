<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import ParameterDialog from './ParameterDialog.svelte'

  export const showParameterDialog = (props): Promise<unknown> =>
    dialogs.showOnce(ParameterDialog, props)

  export enum ParameterType {
    Text = 'Text',
  }
</script>

<script lang="ts">
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Field from 'webkit/ui/Field/svelte'
  import FieldSelector from 'webkit/ui/Field/Select.svelte'
  // import Field from './Field.svelte'

  export let parameter
  export let onSubmit

  let closeDialog

  $: ({ name, value, type = 'Text' } = parameter || {})

  function onFormSubmit({ currentTarget: form }) {
    const changed = parameter || {}

    changed.name = form.name.value.trim()
    changed.value = form.value.value.trim()
    changed.type = type

    console.log(changed, form)

    onSubmit(changed)
    closeDialog()
  }
</script>

<Dialog
  bind:closeDialog
  {...$$props}
  title={parameter ? 'Parameter Options' : 'Add Parameter'}
  class="$style.dialog">
  <form class="dialog-body" on:submit|preventDefault={onFormSubmit}>
    <Field
      title="Name"
      name="name"
      placeholder="Name of the parameter"
      value={name}
      autocomplete="off" />
    <FieldSelector title="Type" bind:selected={type} options={['Text']} class="mrg-xl mrg--b">
      {type}
      <svelte:fragment slot="option" let:option>{option}</svelte:fragment>
    </FieldSelector>
    <Field
      title="Value"
      name="value"
      placeholder="Default value of the parameter"
      {value}
      autocomplete="off" />

    <div class="row mrg-s mrg--t">
      <button class="add btn-1" type="submit"> {parameter ? 'Save' : 'Add'}</button>
      <button class="btn-2 mrg-s mrg--l" on:click={closeDialog}>Cancel</button>
    </div>
  </form>
</Dialog>

<style>
  .dialog {
    width: 480px;
  }

  .add {
    --h-padding: 49px;
  }
</style>
