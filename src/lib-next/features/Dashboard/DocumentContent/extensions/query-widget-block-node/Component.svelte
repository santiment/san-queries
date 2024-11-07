<script lang="ts">
  import type {
    TDataWidgetKey,
    TDataWidgetLocalParameterKey,
  } from '$lib-next/features/Dashboard/types'
  import { useDataWidgetParameterOverrides } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte.js'

  import { type ViewProps } from 'tiptap-svelte-adapter'
  import { useDashboardSqlQueriesCtx } from './ctx/dashboard-queries.svelte'
  import type { TDataWidgetProps } from '../schema'
  import type { QUERY_WIDGET_BLOCK_NODE } from './schema'

  let { view, data }: TDataWidgetProps<typeof QUERY_WIDGET_BLOCK_NODE> = $props()
  // data.dataWidget.

  // const id = view.$.node.attrs['data-id'] as TDataWidgetKey

  // const dataWidget = { id }
  // const localParameters = { Asset: 'uniswap' }
  // const { parameterOverrides } = useDataWidgetParameterOverrides(id, localParameters)
  // const { getDashboardSqlQueryById } = useDashboardSqlQueriesCtx()
  // console.log('found', getDashboardSqlQueryById(dataWidget.id))

  // $inspect(parameterOverrides.$, id)
</script>

<div class="min-h-20 rounded border">
  {data.id}
</div>
