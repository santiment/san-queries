<script context="module" lang="ts">
  import Component from './SettingsDialog.svelte'

  export const showSettingsDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import { dialogs$ } from 'san-webkit-next/ui/core/Dialog'
  import LinkParameterDialog from '../AssetSelector/LinkParameterDialog.svelte'
  import { useDashboardWidgets, type TEditorWidget } from '$lib/DashboardNext/ctx'

  let { view, ...props }: ComponentProps<LinkParameterDialog> & { view: any } = $props()

  const { dashboardWidgets } = useDashboardWidgets()

  let queryWidgets = $derived(
    Array.from(dashboardWidgets.values()).filter(
      (widget): widget is TEditorWidget<App.ApiQuery> => widget?.type === 'query-widget',
    ),
  )

  let selectedId = $derived(view.$.node.attrs['data-link-query'])
  let selectedWidget = $derived(dashboardWidgets.get(selectedId))

  let availableColumns = $derived(selectedWidget?.state.get('outputs') || [])
  let selectedColumn = $derived(+view.$.node.attrs['data-link-column'])

  function onQuerySelect(e: Event) {
    const node = e.currentTarget as HTMLSelectElement

    view.$.updateAttributes({ 'data-link-query': node.value, 'data-link-column': 0 })
  }

  function onColumnSelect(e: Event) {
    const node = e.currentTarget as HTMLSelectElement
    view.$.updateAttributes({ 'data-link-column': node.value })
  }
</script>

<LinkParameterDialog {...props}>
  <h2 class="text-base font-medium">Controlled list settings</h2>
  <section class="mb-4 mt-2 gap-2">
    <h3 class="text-xs text-waterloo">Shortcut action</h3>

    <form class="gap-2 column">
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
  </section>
</LinkParameterDialog>
