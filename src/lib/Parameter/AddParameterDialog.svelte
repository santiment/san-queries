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

  export let parameter = { key: '', value: '' as string | number, type: 'Text' }
  export let DialogCtx: SAN.Dialog.Ctx

  const { key } = parameter

  function onAddClick() {
    if (parameter.type === 'Number') {
      parameter.value = +parameter.value
    }

    DialogCtx.resolve(parameter)
    DialogCtx.close()
  }
</script>

<Dialog {...$$props} title="{key ? 'Edit' : 'Add'} parameter">
  <div class="dialog-body column gap-l">
    <Control
      name="Name"
      value={parameter.key}
      placeholder="Name of the parameter"
      onUpdate={(value) => (parameter.key = value)}
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
      <button
        class="btn-1"
        on:click={onAddClick}
        class:disabled={!parameter.key || !parameter.value}
      >
        {key ? 'Edit' : 'Add'}
      </button>
      <button class="btn-2" on:click={() => DialogCtx.close()}>Cancel</button>
    </actions>
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 480px;
  }
</style>
