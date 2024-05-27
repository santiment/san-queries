<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './ParameterDialog.svelte'

  export const showGlobalParameterDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import { Map } from 'svelte/reactivity'
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import Form from '$lib/ParameterDialog/Form.svelte'
  import { useDashboardEditorCtx } from '../ctx/index'
  import GlobalQuery from './GlobalQuery.svelte'
  import { OverridesDiff } from './utils'
  import { useCreateGlobalParameterFlow, useUpdateGlobalParameterFlow } from './flow'

  let {
    readonly = false,
    parameter: _parameter = {
      global: true,
      key: '',
      value: '',
      type: 'Text',
      overrides: new Map(),
    },
    DialogCtx,
    ...rest
  }: {
    readonly?: boolean
    parameter?: (typeof dashboardEditor)['parameters']['$'][number]
    DialogCtx: any
  } = $props()

  const { key } = _parameter
  const isNew = !key

  const { dashboardEditor } = useDashboardEditorCtx()
  const { createGlobalParameter } = useCreateGlobalParameterFlow()
  const { updateGlobalParameter } = useUpdateGlobalParameterFlow()

  let queries = $derived(dashboardEditor.widgets.$.filter(checkIsQueryWithParameters))
  let parameter = $state({ ..._parameter })
  let overridesDiff = new OverridesDiff(_parameter.overrides)

  let isLoading = $state(false)

  function checkIsQueryWithParameters(widget: (typeof dashboardEditor)['widgets']['$'][number]) {
    if (widget.type !== 'QUERY') return

    return Object.keys((widget.query as App.ApiQuery).sqlQueryParameters).length > 0
  }

  function onApproveClick() {
    if (!dashboardEditor.id) return
    if (dashboardEditor.readonly) return
    if (isLoading) return

    isLoading = true

    const applyChanges = isNew ? createGlobalParameter : updateGlobalParameter

    applyChanges({
      dashboard: dashboardEditor as { id: number },
      oldKey: key,
      parameter,
      overrides: overridesDiff.unwrap(),
      onComplete,
    })

    function onComplete() {
      DialogCtx.resolve({ ...parameter, overrides: overridesDiff.value })
      DialogCtx.close()
    }
  }
</script>

<Dialog {...rest} {DialogCtx} title="{isNew ? 'Add' : 'Edit'} global parameter" class="w-[480px]">
  <Form bind:parameter {DialogCtx} {isLoading} {onApproveClick}>
    {#if dashboardEditor.isAuthor && queries.length && !readonly}
      <queries class="flex flex-col gap-4">
        <h3 class="text-base font-medium">
          Link local parameters from queries added to this dashboard
        </h3>

        {#each queries as widget}
          <GlobalQuery {widget} {overridesDiff} />
        {/each}
      </queries>
    {/if}
  </Form>
</Dialog>
