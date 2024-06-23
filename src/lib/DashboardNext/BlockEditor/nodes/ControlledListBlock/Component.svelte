<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import { useDashboardEditorCtx } from '$lib/DashboardNext/ctx'

  import DataTable from '$lib/ui/Table/DataTable.svelte'
  import { useControllerListCtx, COLUMNS } from './ctx'
  import InputForm from './InputForm.svelte'
  import { useParametersWidgetFlow } from '../parameters.svelte'
  import { showLinkParameterDialog$ } from '../AssetSelector/LinkParameterDialog.svelte'

  let { view }: ViewProps = $props()

  const { dashboardEditor } = useDashboardEditorCtx()

  const state = useParametersWidgetFlow(view, {
    keyPrefix: 'ControlledList',
    defaultValue: [] as string[],
    type: 'stringList',
  })
  useControllerListCtx(state)

  const showLinkParameterDialog = showLinkParameterDialog$()

  function onLinkParameterClick() {
    const parameter = state.parameter
    if (!parameter) return

    showLinkParameterDialog({ parameter, type: 'stringList' }).then((changed) => {
      Object.assign(parameter, changed)

      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  }
</script>

<NodeViewWrapper
  class="relative my-2 flex max-h-[1000px] min-h-[208px]"
  style={view.$.node.attrs.style}
>
  <div class="flex-1 rounded border column">
    {#key state.$}
      <DataTable
        data={state.$}
        columns={COLUMNS}
        pagination={false}
        class="column [&>table]:flex-1"
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
