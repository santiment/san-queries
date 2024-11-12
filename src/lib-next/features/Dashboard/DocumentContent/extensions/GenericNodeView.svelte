<script lang="ts">
  import type { TDataWidgetNode } from './schema/data-widget'
  import type { TGlobalParameterNode } from './schema/global-parameter'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import SpinLoader from 'san-webkit/lib/ui/SpinLoader.svelte'
  import { cn } from 'san-webkit-next/ui/utils'
  import ViewComponent from './ViewComponent.svelte'

  let { view }: ViewProps = $props()

  const nodeConfig = view.$.extension.config as TDataWidgetNode | TGlobalParameterNode

  const nodeViewData = nodeConfig.initNodeView(view)
</script>

<!-- data-id={view.$.node.attrs['data-id']} -->
<NodeViewWrapper class={cn('relative', nodeConfig.class)} style={view.$.node.attrs.style}>
  {#if nodeViewData instanceof Promise}
    {#await nodeViewData}
      <div class="min-h-20 rounded border">
        <SpinLoader></SpinLoader>
      </div>
    {:then data}
      <ViewComponent {view} {nodeConfig} {data}></ViewComponent>
    {/await}
  {:else}
    <ViewComponent {view} {nodeConfig} data={nodeViewData}></ViewComponent>
  {/if}
</NodeViewWrapper>
