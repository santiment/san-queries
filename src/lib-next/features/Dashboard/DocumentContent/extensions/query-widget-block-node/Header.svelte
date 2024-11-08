<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'
  import { getSEOLinkFromIdAndTitle } from 'san-webkit-next/utils/url'
  import { useDashboardCtx } from '$lib-next/features/Dashboard/ctx'
  import User from '$lib/ui/User/index.svelte'
  import type { TDataWidgetProps } from '../schema/data-widget'
  import type { QUERY_WIDGET_BLOCK_NODE } from './schema'

  type TProps = {
    id: number
    name: string
    author: App.Author
    widget: TDataWidgetProps<typeof QUERY_WIDGET_BLOCK_NODE>['data']['widget']
    onRefreshClick: () => void
    onDeleteClick?: () => void
  }
  let { id, name, author, widget, onRefreshClick, onDeleteClick }: TProps = $props()

  const { dashboard } = useDashboardCtx.get()

  function onFullscreenClick() {}
</script>

<header class="flex items-center gap-2 py-3 pl-3 pr-[18px]">
  <User user={author} class="text-waterloo"></User>

  <div class="h-8 border-l"></div>

  <h2 class="mr-auto min-w-0 text-base single-line">
    <a href="/query/{getSEOLinkFromIdAndTitle(id, name)}" class="hover:text-green">{name}</a>
  </h2>

  <Button explanation="Refresh data" icon="refresh" iconSize={14} onclick={onRefreshClick}></Button>

  <Button explanation="Open fullscreen" icon="fullscreen" iconSize={14} onclick={onFullscreenClick}
  ></Button>

  {#if dashboard.isEditable}
    <Button explanation="Remove widget" icon="close" iconSize={12} onclick={onDeleteClick}></Button>
  {/if}
</header>
