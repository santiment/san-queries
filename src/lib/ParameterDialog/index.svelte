<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './index.svelte'

  export const showParameterDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import Form from './Form.svelte'

  let {
    parameter: _parameter = { key: '', value: '', type: 'Text' },
    DialogCtx,
    ...rest
  }: {
    parameter?: { key: string; value: string | number; type: 'Text' | 'Number' }
    DialogCtx: any
  } = $props()

  const { key } = _parameter
  let parameter = $state({ ..._parameter })

  function onApproveClick() {
    DialogCtx.resolve({ ...parameter })
    DialogCtx.close()
  }
</script>

<Dialog {...rest} {DialogCtx} title="{key ? 'Edit' : 'Add'} parameter" class="w-[480px]">
  <Form bind:parameter {DialogCtx} {onApproveClick}></Form>
</Dialog>
