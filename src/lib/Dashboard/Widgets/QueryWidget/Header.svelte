<script lang="ts">
  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import User from '$lib/ui/User/index.svelte'
  import Button from '$lib/ui/Button.svelte'
  import { useDeleteDashboardQueryFlow } from '$lib/Dashboard/flow/widgets'
  import { useDashboardEditorCtx } from '$lib/Dashboard/ctx'
  import { useDataFlowSqlDataCtx } from '$lib/DataFlow/ctx/sqlData.svelte'
  import { showQueryWidgetFullscreenDialog$ } from './FullscreenDialog.svelte'
  import { useSelectedRowsCtx } from '$lib/Visualization/Table/Selectable/Cell.svelte'

  let {
    widget,
    id,
    name,
    user,
    alert,
    readonly = true,
    onRefreshClick,
    onQueryChangesClick,
    sqlData,
  }: {
    widget: App.Dashboard.QueryWidget
    id: number | string
    name: string
    user: App.Author
    sqlData: App.SqlData
    alert: null | { type: string }
    readonly?: boolean
    onRefreshClick: () => void
    onQueryChangesClick: () => void
  } = $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { deleteDashboardQuery } = useDeleteDashboardQueryFlow()
  const { changedParameters, mountRefreshPrompt } = useDataFlowSqlDataCtx()
  const showQueryWidgetFullscreenDialog = showQueryWidgetFullscreenDialog$()
  const { selections } = useSelectedRowsCtx()

  function onDeleteClick() {
    const dashboardId = dashboardEditor.id
    if (!dashboardId) return

    deleteDashboardQuery({ dashboardId, widget })
  }

  function onFullscreenClick() {
    showQueryWidgetFullscreenDialog({ widget, sqlData })
  }
</script>

<header class="flex items-center gap-2 py-3 pl-3 pr-[18px]">
  <User {user} class="text-waterloo"></User>

  <div class="h-8 border-l"></div>

  <h2 class="single-line mr-auto min-w-0 text-base">
    <a href="/query/{getSEOLinkFromIdAndTitle(id, name)}">{name}</a>
  </h2>

  {#if alert}
    <Button variant="border" icon="alert" class="relative">
      Create alert
      {#if selections.size}
        <span
          class="absolute left-[-8px] top-[-8px] flex size-5 items-center justify-center rounded-full bg-green-light-1 text-[10px] text-green"
        >
          {selections.size}
        </span>
      {/if}
    </Button>
  {/if}

  {#if changedParameters.size > 0}
    <Button
      icon="refresh"
      iconSize={14}
      iconOnRight
      class="rounded-xl p-3 py-1 pr-[9px] transition duration-200 hover:fill-green-hover hover:text-green-hover"
      onclick={onQueryChangesClick}
    >
      <span
        class="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300"
        use:mountRefreshPrompt>Query changes</span
      >
    </Button>
  {:else}
    <Button explanation="Refresh data" icon="refresh" iconSize={14} onclick={onRefreshClick}
    ></Button>
  {/if}

  <Button explanation="Open fullscreen" icon="fullscreen" iconSize={14} onclick={onFullscreenClick}
  ></Button>

  {#if !readonly}
    <Button explanation="Remove widget" icon="close" iconSize={12} onclick={onDeleteClick}></Button>
  {/if}
</header>
