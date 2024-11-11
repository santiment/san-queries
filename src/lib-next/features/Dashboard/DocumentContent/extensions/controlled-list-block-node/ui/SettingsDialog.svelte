<script module lang="ts">
  import Component from './SettingsDialog.svelte'

  export const showSettingsDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import { dialogs$ } from 'san-webkit-next/ui/core/Dialog'
  import LinkParameterDialog from '$lib/DashboardNext/BlockEditor/nodes/AssetSelector/LinkParameterDialog.svelte'
  import {
    useDashboardDataWidgets,
    type TDashboardDataWidgetByType,
  } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte'
  import type { TDataWidgetKey } from '$lib-next/features/Dashboard/types'
  import { useControllerListCtx } from '../ctx'
  import SelectOption from '../../SelectOption.svelte'

  let { view, ...props }: ComponentProps<typeof LinkParameterDialog> & { view: any } = $props()

  const { globalParameter, linkedSqlDataWidget } = useControllerListCtx.get()
  const { dataWidgets } = useDashboardDataWidgets.get()

  const linkedQuery = $derived(linkedSqlDataWidget.$?.id)
  const linkedColumn = $derived(globalParameter.settings.$$.linkedColumn)

  const queryOptions = $derived(
    dataWidgets.$.filter(
      (item) => item.type === 'query-widget',
    ) as TDashboardDataWidgetByType['query-widget'][],
  )
  const columnOptions = $derived(linkedSqlDataWidget.$?.data.outputs || [])

  function onQuerySelect(value: string) {
    globalParameter.settings.$$.linkedQuery = value as TDataWidgetKey
  }

  function onColumnSelect(value: string) {
    globalParameter.settings.$$.linkedColumn = +value
  }
</script>

<LinkParameterDialog {...props}>
  <h2 class="text-base font-medium">Controlled list settings</h2>
  <section class="mb-4 mt-2 gap-2">
    <h3 class="text-xs text-waterloo">Shortcut action</h3>

    <form class="gap-2 column">
      <SelectOption
        title="Query"
        name="query"
        value={linkedQuery}
        options={queryOptions}
        onChange={onQuerySelect}
      >
        {#snippet children({ option })}
          <option value={option.id}>{option.data.sqlQuery?.name}</option>
        {/snippet}
      </SelectOption>

      <SelectOption
        title="Column"
        name="column"
        value={linkedColumn}
        options={columnOptions}
        onChange={onColumnSelect}
      >
        {#snippet children({ option, i })}
          <option value={i}>{option}</option>
        {/snippet}
      </SelectOption>
    </form>
  </section>
</LinkParameterDialog>
