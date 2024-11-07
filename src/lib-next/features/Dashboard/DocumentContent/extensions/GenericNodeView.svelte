<script lang="ts">
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import SpinLoader from 'san-webkit/lib/ui/SpinLoader.svelte'
  import type { TDataWidgetNode, TDataWidgetProps } from './schema'

  let { view }: ViewProps = $props()

  const nodeConfig = view.$.extension.config as TDataWidgetNode

  const asyncData = Promise.all([nodeConfig.asyncCompnent, nodeConfig.initNodeView(view)])
</script>

<NodeViewWrapper class="relative">
  {#await asyncData}
    <div class="min-h-20 rounded border">
      <SpinLoader></SpinLoader>
    </div>
  {:then [Component, data]}
    {#if data.id && data.dataWidget}
      <Component {view} data={data as TDataWidgetProps['data']}></Component>
    {/if}
  {/await}
</NodeViewWrapper>
