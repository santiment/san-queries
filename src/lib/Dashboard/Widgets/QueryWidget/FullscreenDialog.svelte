<script context="module" lang="ts">
  import Component from './FullscreenDialog.svelte'

  export const showQueryWidgetFullscreenDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import Visualisation from './Visualisation.svelte'
  import Dialog, { dialogs$ } from 'san-webkit-next/ui/core/Dialog'

  let {
    widget,
    sqlData,
  }: {
    widget: App.Dashboard.QueryWidget
    sqlData: App.SqlData
  } = $props()
</script>

<Dialog class="min-h-[95%] min-w-[95%] column" title="Query visualization">
  <Visualisation {widget} {sqlData}></Visualisation>
</Dialog>
