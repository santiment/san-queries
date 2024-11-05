<script lang="ts">
  import { BROWSER } from 'esm-env'
  import { NodeViewWrapper, type ViewProps } from 'tiptap-svelte-adapter'
  import SpinLoader from 'san-webkit/lib/ui/SpinLoader.svelte'

  let { view }: ViewProps = $props()

  const { Component, initData } = view.$.extension.config

  const data = BROWSER ? initData?.(view) : undefined
  console.log({ data })
</script>

<NodeViewWrapper class="relative">
  {#if data instanceof Promise}
    {#await data}
      <div class="min-h-20 rounded border">
        <SpinLoader></SpinLoader>
      </div>
    {:then _data}
      <Component {view} data={_data}></Component>
    {/await}
  {:else}
    <Component {view} {data}></Component>
  {/if}
</NodeViewWrapper>
