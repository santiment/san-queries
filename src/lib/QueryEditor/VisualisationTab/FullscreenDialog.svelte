<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './FullscreenDialog.svelte'

  export const showVisualisationFullscreenDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import VisualisationTab from './index.svelte'

  let {
    sqlData,
    readonly,
    ...props
  }: {
    sqlData: App.SqlData
    readonly: boolean
  } = $props()
</script>

<Dialog {...props} class="min-h-[95%] min-w-[95%]" title="Query visualization">
  <VisualisationTab {sqlData} {readonly} isWithControls={false}></VisualisationTab>
</Dialog>
