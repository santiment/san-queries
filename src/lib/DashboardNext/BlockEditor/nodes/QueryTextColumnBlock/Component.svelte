<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import {
    useDashboardEditorCtx,
    useDashboardWidgets,
    type TEditorWidget,
  } from '$lib/DashboardNext/ctx'
  import Text from './Text.svelte'

  let { view }: ViewProps = $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { dashboardWidgets } = useDashboardWidgets()

  let queryWidgets = $derived(
    Array.from(dashboardWidgets.values()).filter(
      (widget): widget is TEditorWidget<App.ApiQuery> => widget?.type === 'query-widget',
    ),
  )

  let queryWidgetMap = $derived(new Map(queryWidgets.map((widget) => [widget.id, widget])))
  let selectedId = $derived(view.$.node.attrs['data-link-query'])
  let selectedWidget = $derived(queryWidgetMap.get(selectedId))

  let availableColumns = $derived(selectedWidget?.state.get('outputs') || [])
  let selectedColumn = $derived(+view.$.node.attrs['data-link-column'])

  function onQuerySelect(e: Event) {
    const node = e.currentTarget as HTMLSelectElement
    view.$.updateAttributes({ 'data-link-query': node.value })
  }

  function onColumnSelect(e: Event) {
    const node = e.currentTarget as HTMLSelectElement
    view.$.updateAttributes({ 'data-link-column': node.value })
  }
</script>

<NodeViewWrapper>
  {#if dashboardEditor.readonly}
    <Text queryWidget={selectedWidget} column={selectedColumn}></Text>
  {:else}
    <div class="gap-3 rounded border border-dashed border-blue p-3 column">
      <div class="items-center gap-2 rounded border border-blue bg-blue-light-1 fill-blue p-3 row">
        <Svg id="info" w="16"></Svg>
        This block displays column's text data from a selected query
      </div>

      <form action="" class="gap-2 column">
        <div class="flex">
          Query:
          <select name="query" class="flex-1" onchange={onQuerySelect} value={selectedId}>
            <option value="">--Choose query--</option>
            {#each queryWidgets as widget}
              <option value={widget.id}>{widget.data.name}</option>
            {/each}
          </select>
        </div>

        <div class="flex">
          Column:
          <select name="column" class="flex-1" onchange={onColumnSelect} value={selectedColumn}>
            <option value="">--Choose column--</option>
            {#each availableColumns as column, i}
              <option value={i}>{column}</option>
            {/each}
          </select>
        </div>
      </form>
    </div>
  {/if}
</NodeViewWrapper>
