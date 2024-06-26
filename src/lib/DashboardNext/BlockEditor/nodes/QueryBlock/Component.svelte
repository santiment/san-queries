<script lang="ts">
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import QueryWidget from '$lib/Dashboard/Widgets/QueryWidget/index.svelte'
  import { useDahboardSqlDataCtx } from '$lib/Dashboard/flow/sqlData/index.svelte'
  import { useDashboardEditorCtx, useEditorWidget } from '$lib/DashboardNext/ctx'
  import Resizer from '../../Resizer.svelte'

  let { view }: ViewProps = $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { dashboardData, refreshDashboardQueryData } = useDahboardSqlDataCtx()

  let id = $derived(view.$.node.attrs['data-id'])
  let widgetRef = useEditorWidget<App.ApiDashboard['queries'][0]>(id)
  let dataState = $derived(dashboardData.get(id))

  function onResizeEnd(newHeight: string) {
    view.$.updateAttributes({ style: 'height:' + newHeight })
  }

  function getOutputs(sqlData: null | App.SqlData) {
    return sqlData?.columns
  }

  $effect(() => {
    const widget = widgetRef.$
    if (!widget) return
    if (!dataState) return

    widget.state.set('outputs', getOutputs(dataState.defaultData.$))
    widget.state.set('sqlData', dataState.displayedData.$)
  })
</script>

<NodeViewWrapper
  class="relative my-2 max-h-[1000px] min-h-[208px] column"
  style={view.$.node.attrs.style}
>
  {#if widgetRef.$}
    <QueryWidget
      dashboardId={dashboardEditor.id}
      readonly={dashboardEditor.readonly}
      widget={{
        id: widgetRef.$.id,
        type: 'QUERY',
        title: widgetRef.$.data.name,
        query: widgetRef.$.data,
      }}
      onDeleteClick={() => view.$.deleteNode()}
    />

    {#if dashboardEditor.readonly === false}
      <Resizer onEnd={onResizeEnd}></Resizer>
    {/if}
  {:else}
    Unknown query widget
    <button onclick={view.$.deleteNode}>Delete</button>
  {/if}
</NodeViewWrapper>
