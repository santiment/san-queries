<script lang="ts">
  import Button from '$lib/ui/Button.svelte'
  import { useSelectedRowsCtx } from '$lib/Visualization/Table/Selectable/Cell.svelte'
  import { showAlertCreationDialog } from '$lib/l__AlertCreation/Dialog.svelte'
  import { getAddressInfrastructure } from 'san-webkit/lib/utils/address'
  import { useDataFlowCtx } from '$lib/DataFlow/ctx'
  import { get } from 'svelte/store'

  let { widget } = $props()

  const { FlowNodeByWidgetId } = useDataFlowCtx()
  const { selections } = useSelectedRowsCtx()

  let flowNode = $derived(FlowNodeByWidgetId.get(widget.id))
  let alertInstance = $state.frozen(null)

  $effect(() => {
    const subscriber = flowNode?.state$.subscribe((value) => {
      alertInstance = value.alertInstance
    })
    return () => subscriber?.unsubscribe()
  })

  function onCreateAlertClick() {
    if (!alertInstance) return

    const { state$, process$ } = alertInstance

    if (!process$) return

    const target = get(process$)
    const { type } = get(state$)
    console.log({ target, type })

    if (type === 'wallet_movement') {
      const address = target.address[0]
      const infrastructure = getAddressInfrastructure(address || '')

      return showAlertCreationDialog({
        settings: {
          type,
          target: { ...target, use_combined_balance: true },
          selector: { infrastructure },
        },
      })
    }

    if (type === 'metric_signal') {
      return showAlertCreationDialog({
        settings: { type, target },
      })
    }
  }
</script>

{#if alertInstance}
  <Button variant="border" icon="alert" class="relative" onclick={onCreateAlertClick}>
    Create alert
    {#if selections.size}
      <span
        class="absolute left-[-8px] top-[-8px] flex size-5 items-center justify-center rounded-full bg-green-light-1 text-[10px] text-green"
      >
        {selections.size}
      </span>
    {/if}
  </Button>
{/if}
