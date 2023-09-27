<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './AddParameterDialog.svelte'

  export const showAddParameterDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  // import { getQueryEditor$Ctx } from '$routes/query/new/ctx'

  import Control from '$lib/QueryEditor/Visualisation/Control.svelte'

  // const { queryEditor$ } = getQueryEditor$Ctx()

  export let parameter = { title: '', value: '', type: 'Text' }
  export let DialogCtx: SAN.Dialog.Ctx

  function onAddClick() {
    console.log(parameter)
  }
</script>

<Dialog {...$$props} title="Add parameter">
  <div class="dialog-body column gap-l">
    <Control
      name="Name"
      value={parameter.title}
      placeholder="Name of the parameter"
      onUpdate={(value) => (parameter.title = value)}
    />

    <Control
      name="Type"
      options={['Text', 'Number']}
      value={parameter.type}
      onUpdate={(value) => (parameter.type = value)}
    />

    <Control
      name="Value"
      value={parameter.value}
      placeholder="Default value of the parameter"
      onUpdate={(value) => (parameter.value = value)}
    />

    <!-- <SQLEditor value={$queryEditor$.sql} onValueChange={onEditorValueChange} /> -->

    <actions class="row gap-l mrg-l mrg--t">
      <button class="btn-1" on:click={onAddClick}>Add</button>
      <button class="btn-2" on:click={() => DialogCtx.close()}>Cancel</button>
    </actions>
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 480px;
  }
</style>
