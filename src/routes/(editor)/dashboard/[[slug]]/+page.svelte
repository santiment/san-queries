<script lang="ts">
  import type { PageData } from './$types'

  import { BROWSER } from 'esm-env'
  import { ss, ssd } from 'svelte-runes'
  // import Dashboard from '$lib/Dashboard/Dashboard.svelte'
  import Dashboard from '$lib/DashboardNext/index.svelte'
  import SaveIndicator from '$lib/SaveIndicator'
  import { useSaveIndicatorCtx } from '$lib/SaveIndicator/index.svelte'
  import { useDashboardDuplicateFlow } from '$lib/Dashboard/flow/duplicate'
  import { useDashboardDeleteFlow } from '$lib/Dashboard/flow/delete'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

  let { data }: { data: PageData } = $props()

  const apiDashboard = ssd(() => data.apiDashboard)
  const { currentUser } = useCustomerCtx()

  const _saveIndicatorCtx = useSaveIndicatorCtx()
  const EditorRef = ss<Dashboard>()

  let isAuthor = ssd(() =>
    apiDashboard.$ ? +apiDashboard.$.user.id === +currentUser.$$?.id! : true,
  )

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
    currentUser={currentUser.$$}
    {onDuplicateClick}
    {onDeleteClick}
  ></Dashboard>
{/key}
