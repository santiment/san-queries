<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import ParameterDialog from './ParameterDialog.svelte'

  export const showParameterDialog = (props): Promise<unknown> =>
    dialogs.showOnce(ParameterDialog, props)
</script>

<script lang="ts">
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Field from 'webkit/ui/Field/svelte'
  import FieldSelector from 'webkit/ui/Field/Select.svelte'

  export let parameter
  export let onSubmit

  let closeDialog
  let { key, value, type = 'Text' } = parameter || {}

  function onFormSubmit() {
    if (!key) return

    const changed = parameter || {}

    changed.key = key.trim()
    changed.value = type === 'Number' ? +value : value.trim()
    changed.type = type

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
      bind:value={key}
      autofocus
      required
      title="Name"
      name="name"
      placeholder="Name of the parameter"
      autocomplete="off" />

    <FieldSelector
      bind:selected={type}
      title="Type"
      options={['Text', 'Number']}
      class="mrg-xl mrg--b">
      {type}
      <svelte:fragment slot="option" let:option>{option}</svelte:fragment>
    </FieldSelector>

    <Field
      bind:value
      required
      title="Value"
      name="value"
      placeholder="Default value of the parameter"
      autocomplete="off" />

    <div class="row mrg-s mrg--t">
      <button class="add btn-1" type="submit" class:disabled={!key || !value}
        >{parameter ? 'Save' : 'Add'}</button>
      <button type="button" class="btn-2 mrg-s mrg--l" on:click={closeDialog}>Cancel</button>
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
