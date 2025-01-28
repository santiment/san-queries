<script lang="ts">
  import type { TDataWidgetKey } from '$lib-next/dashboard/types'

  import { NodeViewWrapper } from 'tiptap-svelte-adapter'
  import { useDashboardCtx } from '$lib-next/dashboard/ctx'
  import {
    useDashboardDataWidgets,
    type TDashboardDataWidgetByType,
  } from '$lib-next/dashboard/ctx/data-widgets.svelte'
  import Note from '../../utils/Note.svelte'
  import SelectOption from '../../SelectOption.svelte'
  import Text from './Text.svelte'
  import type { TDataWidgetProps } from '../../schema/data-widget'
  import type { QUERY_TEXT_COLUMN_BLOCK_NODE } from '../schema'

  let { data }: TDataWidgetProps<typeof QUERY_TEXT_COLUMN_BLOCK_NODE> = $props()

  const { dashboard } = useDashboardCtx.get()
  const { dataWidgets } = useDashboardDataWidgets.get()

  const { widget } = data

  const linkedQueryKey = $derived(widget.settings.$$.linkedQuery) as '' | TDataWidgetKey
  const linkedColumnKey = $derived(+widget.settings.$$.linkedColumn!) as number

  const queryOptions = $derived(
    dataWidgets.$.filter(
      (item) => item.type === 'query-widget',
    ) as TDashboardDataWidgetByType['query-widget'][],
  )

  const linkedSqlDataWidget = $derived(queryOptions.find((item) => item.id === linkedQueryKey))

  function onQuerySelect(value: string) {
    widget.settings.$$.linkedQuery = value as TDataWidgetKey
  }

  function onColumnSelect(value: string) {
    widget.settings.$$.linkedColumn = value
  }
</script>

<NodeViewWrapper>
  {#if dashboard.isEditable}
    {@const columnOptions = linkedSqlDataWidget?.data.outputs || []}
    <div class="gap-3 rounded border border-dashed border-blue p-3 column">
      <Note class="border-red bg-red-light-1 fill-red">This widget will be removed soon</Note>
      <Note>This block displays column's text data from a selected query</Note>

      <form action="" class="gap-2 column">
        <SelectOption
          title="Query"
          name="query"
          value={linkedQueryKey}
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
          value={linkedColumnKey}
          options={columnOptions}
          onChange={onColumnSelect}
        >
          {#snippet children({ option, i })}
            <option value={i}>{option}</option>
          {/snippet}
        </SelectOption>
      </form>
    </div>
  {:else}
    <Text sqlDataWidget={linkedSqlDataWidget} column={linkedColumnKey}></Text>
  {/if}
</NodeViewWrapper>
