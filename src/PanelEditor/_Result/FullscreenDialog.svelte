<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import FullscreenDialog from './FullscreenDialog.svelte'

  export const showFullscreenDialog = (props): Promise<unknown> =>
    dialogs.showOnce(FullscreenDialog, props)
</script>

<script lang="ts">
  import { track } from 'webkit/analytics'
  import Dialog from 'webkit/ui/Dialog'
  import Visualization from './Visualization.svelte'

  export let panel
  export let columns
  export let dateColumns
  export let rows
  export let visibleColumns

  let closeDialog
</script>

<Dialog bind:closeDialog {...$$props} noTitle animated={false} class="$style.dialog">
  <Visualization
    {panel}
    {columns}
    {rows}
    {dateColumns}
    {visibleColumns}
    onFullscreenClick={closeDialog} />
</Dialog>

<style>
  .dialog {
    width: 96%;
    height: 92%;
    padding: 16px;
    --table-max-height: 100%;
  }
</style>
