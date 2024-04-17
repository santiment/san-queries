<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './LinkGlobalParameterDialog.svelte'

  export const showLinkGlobalParameterDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import Checkbox from '$lib/ui/Checkbox'
  import Parameter from '$lib/ui/Parameter'
  import { useDashboardEditorCtx } from '$lib/Dashboard/ctx/index'
  import Button from '$lib/ui/Button.svelte'
  import { useLinkGlobalParameterFlow } from '$lib/Dashboard/GlobalParameters/flow'
  import { cn } from '$lib/ui/utils'

  let {
    queryWidgetId,
    parameter,
    globalParameter,
    DialogCtx,
    ...rest
  }: {
    queryWidgetId: string
    parameter: { key: string }
    globalParameter?: { key: string }
    DialogCtx: any
  } = $props()

  const initialGlobalParameter = globalParameter
  const { dashboardEditor } = useDashboardEditorCtx()
  const { linkGlobalParameter } = useLinkGlobalParameterFlow()

  let isLoading = $state(false)
  let parameters = $derived(dashboardEditor.parameters.$)
  let disabled = $derived(initialGlobalParameter === globalParameter)

  function onToggle(parameter: typeof globalParameter) {
    globalParameter = globalParameter === parameter ? undefined : parameter
  }

  function onApplyClick() {
    if (disabled || !queryWidgetId) {
      return DialogCtx.close()
    }

    isLoading = true

    linkGlobalParameter({
      dashboard: dashboardEditor as { id: number },
      dashboardQueryMappingId: queryWidgetId,
      queryParameterKey: parameter.key,
      oldParameterKey: initialGlobalParameter?.key,
      newParameterKey: globalParameter?.key,
      onComplete,
    })

    function onComplete() {
      DialogCtx.resolve(globalParameter)
      DialogCtx.close()
    }
  }
</script>

<Dialog {...rest} {DialogCtx} title="Link to global parameter" class="w-[600px]">
  <div class="dialog-body flex flex-col gap-4">
    {#if parameters.length}
      <queries class="flex flex-col gap-4">
        <h3 class="text-base font-medium">
          Link this local parameter to one of these global parameters
        </h3>

        {#each parameters as parameter, i}
          <global-parameter class="flex items-center gap-2">
            <Checkbox value={parameter === globalParameter} onclick={() => onToggle(parameter)} />

            <Parameter global {parameter} />
          </global-parameter>
        {/each}
      </queries>
    {/if}

    <actions class="mt-4 flex gap-4">
      <Button variant="fill" onclick={onApplyClick} {disabled} class={cn(isLoading && 'loading')}>
        Apply
      </Button>

      <Button variant="border" onclick={DialogCtx.close}>Cancel</Button>
    </actions>
  </div>
</Dialog>
