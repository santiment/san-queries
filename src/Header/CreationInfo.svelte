<script lang="ts">
  import CreationInfo from 'webkit/ui/CreationInfo/svelte'
  import { CreationType } from 'webkit/ui/Profile/types'
  import { currentUser as currentUser$ } from 'studio/stores/user'
  import { getAppContext } from '@/context'
  import { showSaveDashboardDialog } from '@/SaveDashboardDialog.svelte'
  import { mutateCreateDashboard, mutateCreateDashboardPanel } from '@/api/dashboard/create'

  export let onCommentsClick

  const ctx = getAppContext()
  const { dashboard$ } = ctx

  $: dashboard = $dashboard$
  $: currentUser = $currentUser$

  $: ({ id, title, user, commentsCount, votes, description } = dashboard)
  $: isAuthor = currentUser && user && +user.id === +currentUser.id

  function getState() {
    if (!dashboard.user)
      return {
        title: 'New dashboard',
        action: 'Create',
        dashboardMutation: mutateCreateDashboard,
        panelMutation: mutateCreateDashboardPanel,
      }

    if (isAuthor)
      return {
        title: 'Edit dashboard',
        action: 'Save',
        // dashboardMutation: mutateUpdateDashboard,
        // panelMutation: mutateUpdateDashboardPanel,
      }

    return {
      title: 'Duplicate dashboard',
      action: 'Duplicate',
      dashboardMutation: mutateCreateDashboard,
      panelMutation: mutateCreateDashboardPanel,
    }
  }

  function onEditClick() {
    if (!currentUser) return

    const handler = getState()
    console.log({ handler })

    showSaveDashboardDialog({
      ...getState(),
      dashboard,
      onSubmit: console.log,
    }).then((dashboard?: SAN.Queries.Dashboard) => {
      if (!dashboard) return

      dashboard$.set(dashboard)
    })
  }

  function onVote() {}
</script>

<CreationInfo
  fallback="Unsaved dashboard"
  type={CreationType.Dashboard}
  {id}
  {title}
  {user}
  {votes}
  {currentUser}
  editLabel={isAuthor ? 'Edit dashboard' : 'Save as'}
  comments={{
    count: commentsCount,
    active: false, // $Sidewidget === SidewidgetType.LAYOUT_COMMENTS,
    onClick: onCommentsClick,
  }}
  {onEditClick}
  {onVote}>
  <svelte:fragment slot="info">{description}</svelte:fragment>
</CreationInfo>
