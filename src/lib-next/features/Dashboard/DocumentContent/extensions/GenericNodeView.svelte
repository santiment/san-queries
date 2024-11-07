<script lang="ts">
  import type { TDataWidgetNode, TDataWidgetProps } from './schema/data-widget'
  import type {
    TGlobalParameterNode,
    TGlobalParametersWidgetProps,
  } from './schema/global-parameter'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import SpinLoader from 'san-webkit/lib/ui/SpinLoader.svelte'
  import { cn } from 'san-webkit-next/ui/utils'

  let { view }: ViewProps = $props()

  const nodeConfig = view.$.extension.config as TDataWidgetNode | TGlobalParameterNode

  const nodeViewData = nodeConfig.initNodeView(view)
</script>

<NodeViewWrapper class={cn('relative', nodeConfig.class)} style={view.$.node.attrs.style}>
  {#if nodeViewData instanceof Promise}
    {#await nodeViewData}
      <div class="min-h-20 rounded border">
        <SpinLoader></SpinLoader>
      </div>
    {:then data}
      {@render nodeView(data)}
    {/await}
  {:else}
    {@render nodeView(nodeViewData)}
  {/if}
</NodeViewWrapper>

{#snippet nodeView(
  data: Partial<TDataWidgetProps['data']> | Partial<TGlobalParametersWidgetProps['data']>,
)}
  {#if data.id && data.widget}
    <nodeConfig.Component {view} data={data as any}></nodeConfig.Component>
  {/if}
{/snippet}
