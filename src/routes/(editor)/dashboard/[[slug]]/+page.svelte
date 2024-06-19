<script lang="ts">
  import type { PageData } from './$types'

  import { BROWSER } from 'esm-env'
  import { ss, ssd, useStore } from 'svelte-runes'
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import { GlobalShortcut$ } from 'san-webkit/lib/utils/events'
  // import Dashboard from '$lib/Dashboard/Dashboard.svelte'
  import Dashboard from '$lib/DashboardNext/index.svelte'
  import SaveIndicator from '$lib/SaveIndicator'
  import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
  import { useDashboardDuplicateFlow } from '$lib/Dashboard/flow/duplicate'
  import { useDashboardDeleteFlow } from '$lib/Dashboard/flow/delete'

  let { data }: { data: PageData } = $props()

  const apiDashboard = ssd(() => data.apiDashboard)
  const { currentUser$ } = getCurrentUser$Ctx()
  const _saveIndicatorCtx = useSaveIndicatorCtx()
  const EditorRef = ss<Dashboard>()

  let currentUser = $currentUser$
  let isAuthor = ssd(() => (apiDashboard.$ ? +apiDashboard.$.user.id === +currentUser?.id! : true))

  const { onDuplicateClick } = useDashboardDuplicateFlow(EditorRef)
  const { onDeleteClick } = useDashboardDeleteFlow(apiDashboard)
</script>

{#if BROWSER}
  <SaveIndicator></SaveIndicator>
{/if}

{#key apiDashboard.$?.id}
  <Dashboard
    bind:this={EditorRef.$}
    dashboard={apiDashboard.$}
    isAuthor={isAuthor.$}
    readonly={true}
    {currentUser}
    {onDuplicateClick}
    {onDeleteClick}
  ></Dashboard>
{/key}

<!-- {#key apiDashboard.$?.id}
  <Dashboard
    bind:this={EditorRef.$}
    dashboard={apiDashboard.$}
    isAuthor={isAuthor.$}
    readonly={true}
    {currentUser}
    {onDuplicateClick}
    {onDeleteClick}
    onLayoutChange={() => changeIndicatorCtx.emit.changed()}
  ></Dashboard>
{/key} -->
