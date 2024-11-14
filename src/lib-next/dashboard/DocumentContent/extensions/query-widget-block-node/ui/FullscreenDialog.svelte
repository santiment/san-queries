<script module lang="ts">
  import type { ComponentProps } from 'svelte'
  import Component from './FullscreenDialog.svelte'

  export const showFullscreenDialog$ = () => dialogs$.new(Component)
</script>

<script lang="ts">
  import Visualisation from './Visualisation.svelte'
  import Dialog, { dialogs$, type TDialogProps } from 'san-webkit-next/ui/core/Dialog'

  type TProps = TDialogProps & Omit<ComponentProps<typeof Visualisation>, 'columnActions'>
  let { sqlQuery, sqlData }: TProps = $props()
</script>

<Dialog class="min-h-[95%] min-w-[95%] column">
  <Visualisation {sqlQuery} {sqlData}></Visualisation>
</Dialog>
