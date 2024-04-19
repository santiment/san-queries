<script lang="ts">
  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import User from '$lib/ui/User/index.svelte'
  import Button from '$lib/ui/Button.svelte'
  import { useDeleteDashboardQueryFlow } from '$lib/Dashboard/flow/widgets'
  import { useDashboardEditorCtx } from '$lib/Dashboard/ctx'

  let {
    widget,
    id,
    name,
    user,
    readonly = true,
    onRefreshClick,
  }: {
    widget: App.Dashboard.QueryWidget
    id: number | string
    name: string
    user: App.Author
    readonly?: boolean
    onRefreshClick: () => void
  } = $props()

  const { dashboardEditor } = useDashboardEditorCtx()
  const { deleteDashboardQuery } = useDeleteDashboardQueryFlow()

  let promptNewRefresh = false
  function onPromptRefreshClick() {}
  function mountPrompt() {}

  function onDeleteClick() {
    const dashboardId = dashboardEditor.id
    if (!dashboardId) return

    deleteDashboardQuery({ dashboardId, widget })
  }
</script>

<header class="flex items-center gap-2 py-3 pl-3 pr-[18px]">
  <User {user} class="text-waterloo"></User>

  <div class="h-8 border-l"></div>

  <h2 class="mr-auto text-base">
    <a href="/query/{getSEOLinkFromIdAndTitle(id, name)}">{name}</a>
  </h2>

  {#if promptNewRefresh}
    <Button
      icon="refresh"
      iconSize={14}
      iconOnRight
      class="rounded-xl p-3 py-1 pr-[9px] transition duration-200 hover:fill-green-hover hover:text-green-hover"
      onclick={onPromptRefreshClick}
    >
      <span
        class="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300"
        use:mountPrompt>Query selections</span
      >
    </Button>
  {:else}
    <Button explanation="Refresh data" icon="refresh" iconSize={14} onclick={onRefreshClick}
    ></Button>
  {/if}

  <Button explanation="Open fullscreen" icon="fullscreen" iconSize={14}></Button>

  {#if !readonly}
    <Button explanation="Remove widget" icon="close" iconSize={12} onclick={onDeleteClick}></Button>
  {/if}
</header>