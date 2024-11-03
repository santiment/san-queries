<script lang="ts">
  import type {
    TDataWidgetKey,
    TDataWidgetLocalParameterKey,
  } from '$lib-next/features/Dashboard/types'
  import { useDataWidgetParameterOverrides } from '$lib-next/features/Dashboard/ctx/data-widget.svelte.js'

  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'

  let { view }: ViewProps = $props()

  const id = view.$.node.attrs['data-id'] as TDataWidgetKey

  const localParameters = { Asset: 'uniswap' }
  const { parameterOverrides } = useDataWidgetParameterOverrides(id, localParameters)

  $inspect(parameterOverrides.$, id)
</script>

<NodeViewWrapper class="relative">
  <div></div>
</NodeViewWrapper>
