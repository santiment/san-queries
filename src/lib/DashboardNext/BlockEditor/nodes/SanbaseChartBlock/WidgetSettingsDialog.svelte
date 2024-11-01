<script module>
  import Component from './WidgetSettingsDialog.svelte'

  export const showWidgetSettingsDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import { ss } from 'svelte-runes'
  import { untrack } from 'svelte'
  import Dialog, {
    dialogs$,
    type TDialogReject,
    type TDialogResolve,
    type TDialogProps,
  } from 'san-webkit-next/ui/core/Dialog'
  import type { ViewProps } from 'tiptap-svelte-adapter'
  import { useGlobalParametersCtx } from '$lib/Dashboard/ctx/parameters'

  type TProps = TDialogProps & { view: ViewProps['view'] }
  let { view, Controller }: TProps = $props()

  const { globalParameters, globalParameterByKey } = useGlobalParametersCtx()

  $inspect(globalParameters.$)

  let queryWidgetMap = $derived(new Map())

  let selectedAssetParameterId = $derived(view.$.node.attrs['data-asset-parameter'])
  let selectedAssetParameter = $derived(globalParameterByKey.$.get(selectedAssetParameterId))

  let selectedFromParameterId = $derived(view.$.node.attrs['data-from-parameter'])
  let selectedFromParameter = $derived(globalParameterByKey.$.get(selectedFromParameterId))

  let selectedToParameterId = $derived(view.$.node.attrs['data-to-parameter'])
  let selectedToParameter = $derived(globalParameterByKey.$.get(selectedToParameterId))

  function onAssetParameterSelect(e: Event) {
    const node = e.currentTarget as HTMLSelectElement
    view.$.updateAttributes({ 'data-asset-parameter': node.value })
  }

  function onFromParameterSelect(e: Event) {
    const node = e.currentTarget as HTMLSelectElement
    view.$.updateAttributes({ 'data-from-parameter': node.value })
  }

  function onToParameterSelect(e: Event) {
    const node = e.currentTarget as HTMLSelectElement
    view.$.updateAttributes({ 'data-to-parameter': node.value })
  }
</script>

<Dialog class="max-h-[480px] w-[500px] rounded-lg">
  <form action="" class="gap-3 p-3 column">
    <div class="flex">
      Asset parameter:
      <select
        name="query"
        class="flex-1 rounded border"
        onchange={onAssetParameterSelect}
        value={selectedAssetParameterId}
      >
        <option value="">--Choose asset paramer --</option>
        {@render parameterOptions()}
      </select>
    </div>

    <div class="flex">
      "from" date parameter:
      <select
        name="column"
        class="flex-1 rounded border"
        onchange={onFromParameterSelect}
        value={selectedFromParameterId}
      >
        <option value="">--Choose from date parameter--</option>
        {@render parameterOptions()}
      </select>
    </div>

    <div class="flex">
      "to" date parameter:
      <select
        name="column"
        class="flex-1 rounded border"
        onchange={onToParameterSelect}
        value={selectedToParameterId}
      >
        <option value="">--Choose "to" date parameter--</option>
        {@render parameterOptions()}
      </select>
    </div>
  </form>
</Dialog>

{#snippet parameterOptions()}
  {#each globalParameters.$ as parameter}
    <option value={parameter.key}>[{parameter.key}] = {parameter.value}</option>
  {/each}
{/snippet}
