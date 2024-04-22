<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './FullscreenDialog.svelte'

  export const showQueryWidgetFullscreenDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import Visualisation from './Visualisation.svelte'

  let {
    widget,
    sqlData,
    ...props
  }: {
    widget: App.Dashboard.QueryWidget
    sqlData: App.SqlData
  } = $props()
</script>

<Dialog {...props} class="min-h-[95%] min-w-[95%]" title="Query visualization">
  <Visualisation {widget} {sqlData}></Visualisation>
</Dialog>
