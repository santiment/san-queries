<script context="module" lang="ts">
  import Component from './LinkParameterDialog.svelte'

  export const showLinkParameterDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import GlobalQuery from '$lib/Dashboard/GlobalParameters/GlobalQuery.svelte'
  import { useUpdateGlobalParameterFlow } from '$lib/Dashboard/GlobalParameters/flow'
  import { OverridesDiff } from '$lib/Dashboard/GlobalParameters/utils'

  import Button from '$lib/ui/Button.svelte'
  import { cn } from '$lib/ui/utils'
  import Dialog, {
    dialogs$,
    type TDialogProps,
    type TDialogResolve,
  } from 'san-webkit-next/ui/core/Dialog'
  import {
    useDashboardEditorCtx,
    useDashboardWidgets,
    type TEditorWidget,
  } from '$lib/DashboardNext/ctx'
  import type { Snippet } from 'svelte'

  let {
    readonly = false,
    parameter: _parameter = {
      global: true,
      key: '',
      value: '',
      type: 'Text',
      overrides: new Map(),
    },
    type = 'string',
    Controller,
    children,
  }: {
    children?: Snippet
    type?: 'string' | 'stringList'
    readonly?: boolean
    parameter?: (typeof dashboardEditor)['parameters']['$'][number]
  } & TDialogProps<(typeof dashboardEditor)['parameters']['$'][number]> = $props()

  const { key } = _parameter

  const { updateGlobalParameter } = useUpdateGlobalParameterFlow()
  const { dashboardWidgets } = useDashboardWidgets()
  const { dashboardEditor } = useDashboardEditorCtx()

  let queryWidgets = $derived(
    Array.from(dashboardWidgets.values()).filter(
      (widget): widget is TEditorWidget<App.ApiQuery> =>
        widget?.type === 'query-widget' && checkIsQueryWithParameters(widget.data),
    ),
  )
  let parameter = $state({ ..._parameter })
  let overridesDiff = new OverridesDiff(_parameter.overrides)

  let isLoading = $state(false)

  function checkIsQueryWithParameters(query) {
    return Object.keys((query as App.ApiQuery).sqlQueryParameters).length > 0
  }

  function onApproveClick() {
    if (isLoading) return

    isLoading = true

    if (readonly) {
      onComplete()
      return
    }

    const applyChanges = updateGlobalParameter

    applyChanges({
      dashboard: dashboardEditor as { id: number },
      oldKey: key,
      parameter,
      overrides: overridesDiff.unwrap(),
      onComplete,
      type,
    })

    function onComplete() {
      Controller.resolve({ ...parameter, overrides: overridesDiff.value })
      Controller.close()
    }
  }
</script>

<Dialog title="Link parameter" class="w-[480px]">
  <div class="scroll-auto p-4 py-3">
    {@render children?.()}

    {#if queryWidgets.length && !readonly}
      <queries class="flex flex-col gap-4">
        <h3 class="text-base font-medium">
          Link local parameters from queries added to this dashboard
        </h3>

        {#each queryWidgets as widget}
          <GlobalQuery {widget} {overridesDiff} />
        {/each}
      </queries>
    {:else}
      No queries with parameters found
    {/if}

    <actions class="mt-4 gap-4 row">
      <Button
        variant="fill"
        onclick={onApproveClick}
        disabled={!parameter.key || !parameter.value}
        class={cn(isLoading && 'loading')}
      >
        {key ? 'Edit' : 'Add'}
      </Button>

      <Button variant="border" onclick={Controller.close}>Cancel</Button>
    </actions>
  </div>
</Dialog>
