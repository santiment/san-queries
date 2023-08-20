<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './FullscreenDialog.svelte'

  export const showSqlEditorFullscreenDialog = () => dialogs.__show(Component)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import SQLEditor from './index.svelte'

  export let title = 'Untitled query'
</script>

<Dialog {...$$props} {title}>
  <SQLEditor />
</Dialog>

<style lang="scss">
  Dialog {
    min-width: 95%;
    min-height: 95%;
  }
</style>
