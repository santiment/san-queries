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
</script>

<Dialog {...$$props} title="Add parameter">
  <div class="dialog-body column gap-l">
    <Control name="Name" value="" placeholder="Name of the parameter" onUpdate={console.log} />
    <Control name="Type" options={['Text', 'Number']} value="Text" onUpdate={console.log} />
    <Control
      name="Value"
      value=""
      placeholder="Default value of the parameter"
      onUpdate={console.log}
    />

    <!-- <SQLEditor value={$queryEditor$.sql} onValueChange={onEditorValueChange} /> -->

    <actions class="row gap-l mrg-l mrg--t">
      <button class="btn-1">Add</button>
      <button class="btn-2">Cancel</button>
    </actions>
  </div>
</Dialog>

<style lang="scss">
  Dialog {
    width: 480px;
  }
</style>
