<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import ParameterDialog from './ParameterDialog.svelte'

  export const showParameterDialog = (props): Promise<unknown> =>
    dialogs.showOnce(ParameterDialog, props)
</script>

<script lang="ts">
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Field from './Field.svelte'

  export let parameter

  let closeDialog

  $: ({ name, value } = parameter || {})

  function onSubmit() {}
</script>

<Dialog
  bind:closeDialog
  {...$$props}
  title={parameter ? 'Parameter Options' : 'Add Parameter'}
  class="$style.dialog">
  <form class="dialog-body" on:submit|preventDefault={onSubmit}>
    <Field title="Name" placeholder="Name of the parameter" value={name} />
    <Field title="Type" value="text" />
    <Field title="Value" placeholder="Default value of the parameter" {value} />

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
