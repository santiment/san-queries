<script lang="ts">
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import SpinLoader from 'san-webkit/lib/ui/SpinLoader.svelte'
  import type { TDataWidgetNode, TDataWidgetProps } from './schema'

  let { view }: ViewProps = $props()

  const nodeConfig = view.$.extension.config as TDataWidgetNode

  const nodeViewData = nodeConfig.initNodeView(view)
</script>

<NodeViewWrapper class="relative">
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

{#snippet nodeView(data: Partial<TDataWidgetProps['data']>)}
  {#if data.id && data.dataWidget}
    <nodeConfig.Component {view} data={data as TDataWidgetProps['data']}></nodeConfig.Component>
  {/if}
{/snippet}
