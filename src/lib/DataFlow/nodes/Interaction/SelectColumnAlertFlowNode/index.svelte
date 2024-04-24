<script lang="ts">
  import { useObservable } from 'svelte-runes'
  import GenericHandle from '../../GenericNode/Handle.svelte'
  import type { SelectColumnAlertFlowNode } from '.'

  let { instance }: { instance: SelectColumnAlertFlowNode } = $props()

  const state = useObservable(instance.state$)

  function onChange(e: Event) {
    const node = e.currentTarget as HTMLSelectElement

    instance._state.next({ type: node.value })
  }
</script>

<div class="w-full p-2">
  <select name="alert" id="" class="w-full" value={state.$.type} onchange={onChange}>
    <option value="metric_signal">Asset metric</option>
    <option value="wallet_movement">Wallet movement</option>
  </select>
</div>

<GenericHandle id="column" type="input" />
