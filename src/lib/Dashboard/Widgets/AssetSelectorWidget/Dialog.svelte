<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './Dialog.svelte'

  export const showSelectAssetDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import ListOfAssets from 'san-webkit/lib/ui/ListOfAssets/index.svelte'

  let { onAssetSelect, ...rest } = $props()
  const { DialogCtx } = rest

  function onSelect(asset) {
    onAssetSelect(asset)
    DialogCtx.close()
  }
</script>

<Dialog {...rest} title="Select asset" class="!min-w-90">
  <main class="flex min-h-[455px] w-[500px] flex-col p-2">
    <ListOfAssets {onSelect}></ListOfAssets>
  </main>
</Dialog>

<style>
  main :global(section) {
    display: flex;
    flex-direction: column;
  }

  main :global(nav) {
    /* padding-left: 16px; */
  }

  main :global(section) :global(.btn) {
    /* margin: 0 16px; */
  }
</style>
