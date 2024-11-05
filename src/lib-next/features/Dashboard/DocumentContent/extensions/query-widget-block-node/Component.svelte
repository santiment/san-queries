<script lang="ts">
  import type {
    TDataWidgetKey,
    TDataWidgetLocalParameterKey,
  } from '$lib-next/features/Dashboard/types'
  import { useDataWidgetParameterOverrides } from '$lib-next/features/Dashboard/ctx/data-widgets.svelte.js'

  import { type ViewProps } from 'tiptap-svelte-adapter'
  import SpinLoader from 'san-webkit/lib/ui/SpinLoader.svelte'

  let { view }: ViewProps = $props()
  console.log(view)

  const id = view.$.node.attrs['data-id'] as TDataWidgetKey

  const localParameters = { Asset: 'uniswap' }
  const { parameterOverrides } = useDataWidgetParameterOverrides(id, localParameters)

  // $inspect(parameterOverrides.$, id)
</script>

<div class="min-h-20 rounded border">
  <SpinLoader></SpinLoader>
</div>
