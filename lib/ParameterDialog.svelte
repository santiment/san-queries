<script context="module" lang="ts">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import ParameterDialog from './ParameterDialog.svelte';
export const showParameterDialog = props => dialogs.showOnce(ParameterDialog, props);</script>

<script lang="ts">import 'san-webkit/lib/analytics';
import Dialog from 'san-webkit/lib/ui/Dialog';
import Field from 'san-webkit/lib/ui/Field/svelte';
import FieldSelector from 'san-webkit/lib/ui/Field/Select.svelte';
export let parameter;
export let onSubmit;
let closeDialog;
let {
  key,
  value,
  type = 'Text'
} = parameter || {};

function onFormSubmit() {
  if (!key) return;
  const changed = parameter || {};
  changed.key = key.trim();
  changed.value = type === 'Number' ? +value : value.trim();
  changed.type = type;
  onSubmit(changed);
  closeDialog();
}</script>

<Dialog
  bind:closeDialog
  {...$$props}
  title={parameter ? 'Parameter Options' : 'Add Parameter'}
  class="dialog-US9u4N">
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
  :global(.dialog-US9u4N) {
    width: 480px;
  }

  .add {
    --h-padding: 49px;
  }
</style>
