<script lang="ts">
  import Grid from 'san-webkit/lib/ui/SnapGrid/Grid.svelte'
  import Resizer from 'san-webkit/lib/ui/SnapGrid/Resizer.svelte'

  import TextWidget from './TextWidget.svelte'
  import QueryWidget from './QueryWidget/index.svelte'
  import { useDashboardEditorCtx } from '../ctx/index'
  import Toolbar from './Toolbar.svelte'

  let { readonly = true, onLayoutChange }: { readonly?: boolean; onLayoutChange?: () => void } =
    $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { layout, widgets } = dashboardEditor

  function initialScroll(node: HTMLElement, widget: any) {
    widget.htmlNode = node

    if (widget.scrolOnMount) {
      widget.scrolOnMount = false
      setTimeout(() => node.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }
  }
</script>

<Grid
  tag="widgets"
  cols={12}
  layout={layout.$}
  rowSize={26}
  minCols={3}
  {readonly}
  {onLayoutChange}
  let:i
  let:gridItem
>
  {@const widget = widgets.$[i]}

  <widget use:initialScroll={widget} use:gridItem class="flex flex-col">
    {#if widget.type === 'TEXT'}
      <TextWidget {readonly} {widget} />
    {:else if widget.type === 'QUERY'}
      <QueryWidget dashboardId={dashboardEditor.id} {readonly} {widget} />
    {:else if widget.type === 'ASSET_SELECTOR'}
      <!-- <AssetSelectorWidget {readonly} {widget}></AssetSelectorWidget> -->

      <!-- 
    {:else if widget.type === 'HEADING'}
      <HeadingWidget {widget} />
    {:else if widget.type === 'IMAGE'}
      <ImageWidget {widget} />

 -->
    {/if}

    {#if !readonly}
      <Resizer onEnd={onLayoutChange} />
    {/if}
  </widget>
</Grid>

{#if !readonly}
  <Toolbar></Toolbar>
{/if}

<style>
  widget > :global(*) {
    height: 100%;
  }
</style>
