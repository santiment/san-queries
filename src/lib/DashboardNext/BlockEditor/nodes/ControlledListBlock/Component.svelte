<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import { useDashboardEditorCtx, useQueryColumnActionsCtx } from '$lib/DashboardNext/ctx'

  import DataTable from '$lib/ui/Table/DataTable.svelte'
  import { useControllerListCtx, COLUMNS } from './ctx'
  import InputForm from './InputForm.svelte'
  import { useParametersWidgetFlow } from '../parameters.svelte'
  import { showSettingsDialog$ } from './SettingsDialog.svelte'

  let { view }: ViewProps = $props()
  let attrs = $derived(view.$.node.attrs)
  let selectedQuery = $derived(attrs['data-link-query'])
  let selectedColumn = $derived(attrs['data-link-column'])

  const { dashboardEditor } = useDashboardEditorCtx()

  const state = useParametersWidgetFlow(view, {
    keyPrefix: 'ControlledList',
    defaultValue: [] as string[],
    type: 'stringList',
  })
  const { addInputValue } = useControllerListCtx(state)
  const { queryColumnAction, addColumnAction, removeColumnAction } = useQueryColumnActionsCtx()

  const showSettingsDialog = showSettingsDialog$()

  function onLinkParameterClick() {
    const parameter = state.parameter
    if (!parameter) return

    showSettingsDialog({ parameter, type: 'stringList', view }).then((changed) => {
      Object.assign(parameter, changed)

      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  }

  $effect(() => {
    const query = selectedQuery
    const column = selectedColumn
    console.log({ selectedQuery, selectedColumn })
    addColumnAction(query, column, {
      label: 'Add to a list',
      onclick: (value: string) => {
        addInputValue(value)
      },
    })

    return () => {
      console.log({ query, column })
      removeColumnAction(query, column)
    }
  })
</script>

<NodeViewWrapper
  class="relative my-2 flex max-h-[1000px] min-h-[208px]"
  style={view.$.node.attrs.style}
>
  <div class="flex-1 rounded border column">
    {#key state.$}
      <DataTable
        class="column [&>table]:flex-1"
        data={state.$}
        columns={COLUMNS}
        pagination={false}
        minRows={4}
      >
        <tfoot>
          <tr class="border-t">
            <td>
              <InputForm></InputForm>
            </td>
          </tr>
        </tfoot>
      </DataTable>
    {/key}
  </div>

  {#if dashboardEditor.readonly === false}
    <button
      class="ml-2 cursor-pointer self-start fill-waterloo hover:fill-green"
      onclick={onLinkParameterClick}
    >
      <Svg id="cog" w="12"></Svg>
    </button>
  {/if}
</NodeViewWrapper>

<style>
  div :global {
    tbody td:empty {
      @apply h-[37px];
    }
  }
</style>
