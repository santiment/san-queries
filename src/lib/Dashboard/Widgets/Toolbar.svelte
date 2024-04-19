<script lang="ts">
  import { showAddQueryToDashboardDialog$ } from '$lib/AddQueryToDashboardDialog/index.svelte'
  import Svg from '$lib/ui/Svg.svelte'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import { useDashboardEditorCtx } from '../ctx'
  import { useSaveEmptyFlowCtx } from '../flow/save'
  import { useAddTextWidgetToDashboardFlow } from '../flow/widgets'
  import { showDataFlowDialog$ } from '$lib/DataFlow/Dialog/index.svelte'

  const { currentUser$ } = getCurrentUser$Ctx()
  const { dashboardEditor } = useDashboardEditorCtx()
  const showAddQueryToDashboardDialog = showAddQueryToDashboardDialog$()
  const { addTextWidgetToDashboard } = useAddTextWidgetToDashboardFlow()
  const { saveEmptyDashboard, postponeAction, getPostponedAction } = useSaveEmptyFlowCtx()
  const showDataFlowDialog = showDataFlowDialog$()

  function onTextClick() {
    const dashboardId = dashboardEditor.id

    if (dashboardId) {
      return addTextWidgetToDashboard({ dashboardId })
    }

    postponeAction('onTextClick')
    saveEmptyDashboard({})
  }

  function onQueryClick() {
    const dashboardId = dashboardEditor.id
    if (dashboardId) {
      return showAddQueryToDashboardDialog({ strict: true, dashboardId })
    }

    postponeAction('onQueryClick')
    saveEmptyDashboard({})
  }

  $effect(() => {
    const actions = { onTextClick, onQueryClick }
    actions[getPostponedAction()]?.()
  })

  const SAN_TEAM = new Set([1273])
</script>

<toolbar
  class="row z-100 fixed bottom-4 left-1/2 -translate-x-1/2 items-center gap-3 self-center rounded-md bg-rhino-day fill-white-day px-6 py-2 text-xs text-white-day shadow"
>
  <button class="btn" onclick={onQueryClick}>
    <Svg id="query" w="16" />
    Query
  </button>
  <button class="btn" onclick={onTextClick}>
    <Svg id="editor/title" w="16" />
    Text
  </button>

  {#if SAN_TEAM.has(+($currentUser$?.id as number))}
    <div class="mx-3 h-10 border-l"></div>

    <button class="btn" on:click={() => showDataFlowDialog()}>
      <Svg id="share-dots" w="16" />
      Data Flow
    </button>
  {/if}
</toolbar>

<style>
  button {
    gap: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 10px;
    padding-top: 8px;
    --color-hover: var(--green);
    min-width: 32px;
  }
</style>
