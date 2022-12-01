<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import FullscreenDialog from './FullscreenDialog.svelte'

  export const showFullscreenDialog = (props): Promise<unknown> =>
    dialogs.showOnce(FullscreenDialog, props)
</script>

<script lang="ts">
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  // import Visualization from './Visualization.svelte'
  import Editor from './Async.svelte'

  export let setValue

  let editor
  let closeDialog

  function onBeforeDialogClose() {
    setValue(editor.getValue())
  }
</script>

<Dialog
  bind:closeDialog
  {...$$props}
  {onBeforeDialogClose}
  noTitle
  animated={false}
  class="$style.dialog">
  <Editor bind:editor {...$$props} onFullscreenClick={closeDialog} />
</Dialog>

<style>
  .dialog {
    width: 96%;
    height: 92%;
    padding: 16px;
  }
</style>
