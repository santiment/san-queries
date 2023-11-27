<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import Component from './FullscreenDialog.svelte'

  // export const showSqlEditorFullscreenDialog = () => dialogs.__show(Component)
  export const showSqlEditorFullscreenDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import { getQueryEditor$Ctx } from '$routes/(editor)/query/ctx'
  import SQLEditor from './index.svelte'

  export let title = 'Untitled query'

  const { queryEditor$ } = getQueryEditor$Ctx()

  function onEditorValueChange(sql: string) {
    queryEditor$.set({ sql })
  }
</script>

<Dialog {...$$props} {title}>
  <SQLEditor value={$queryEditor$.sql} onValueChange={onEditorValueChange} />
</Dialog>

<style lang="scss">
  Dialog {
    min-width: 95%;
    min-height: 95%;
  }
</style>
