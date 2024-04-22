<script lang="ts">
  import type { PageData } from './$types'

  import { ss, ssd, useStore } from 'svelte-runes'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import { GlobalShortcut$ } from 'san-webkit/lib/utils/events'
  import Dashboard from '$lib/Dashboard/Dashboard.svelte'
  import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
  import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
  import { useDashboardDuplicateFlow } from '$lib/Dashboard/flow/duplicate'
  import { useAutoSaveFlow, useSaveEmptyFlowCtx, useSaveFlow } from '$lib/Dashboard/flow/save'
  import { useDashboardDeleteFlow } from '$lib/Dashboard/flow/delete'

  let { data }: { data: PageData } = $props()

  const apiDashboard = ssd(() => data.apiDashboard)
  const { currentUser$ } = getCurrentUser$Ctx()
  const changeIndicatorCtx = useChangeIndicatorCtx()
  const _saveIndicatorCtx = useSaveIndicatorCtx()
  const EditorRef = ss<Dashboard>()

  $inspect(data)

  let currentUser = $currentUser$
  let isAuthor = ssd(() => (apiDashboard.$ ? +apiDashboard.$.user.id === +currentUser?.id! : true))

  useAutoSaveFlow(EditorRef, isAuthor)
  const { saveEmptyDashboard } = useSaveEmptyFlowCtx(apiDashboard)
  const { saveDashboard } = useSaveFlow(EditorRef, isAuthor)
  const { onDuplicateClick } = useDashboardDuplicateFlow(EditorRef)
  const { onDeleteClick } = useDashboardDeleteFlow(apiDashboard)

  useStore(GlobalShortcut$('CMD+S', () => saveDashboard(), false))
</script>

{#key apiDashboard.$?.id}
  <Dashboard
    bind:this={EditorRef.$}
    dashboard={apiDashboard.$}
    isAuthor={isAuthor.$}
    {currentUser}
    {onDuplicateClick}
    {onDeleteClick}
    onLayoutChange={() => changeIndicatorCtx.emit.changed()}
  ></Dashboard>
{/key}
