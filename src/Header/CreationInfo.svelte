<script lang="ts">
  import { notifications$ } from 'webkit/ui/Notifications'
  import CreationInfo from 'webkit/ui/CreationInfo/svelte'
  import { CreationType } from 'webkit/ui/Profile/types'
  import { getAppContext } from '@/context'
  import { showSaveDashboardDialog } from '@/SaveDashboardDialog.svelte'
  import { mutateCreateDashboard, mutateCreateDashboardPanel } from '@/api/dashboard/create'
  import { mutateUpdateDashboard, mutateUpdateDashboardPanel } from '@/api/dashboard/update'

  export let dashboard
  export let currentUser
  export let isAuthor
  export let onCommentsClick

  const { dashboard$ } = getAppContext()

  $: ({ id, title, user, commentsCount, votes, description } = dashboard)

  function getState() {
    if (!dashboard.user) {
      return {
        title: 'New dashboard',
        action: 'Create',
      }
    }

    if (isAuthor) {
      return {
        title: 'Edit dashboard',
        action: 'Save',
      }
    }

    return {
      title: 'Duplicate dashboard',
      action: 'Duplicate',
    }
  }

  function onEditClick() {
    if (!currentUser) return

    const handler = getState()

    showSaveDashboardDialog({
      ...getState(),
      dashboard,
    }).then((dashboard?: SAN.Queries.Dashboard) => {
      if (dashboard) dashboard$.set(dashboard)
    })
  }

  function onVote() {}
</script>

<div class="row">
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
    hasInfo={description}
    {onEditClick}
    {onVote}>
    <svelte:fragment slot="info">{description}</svelte:fragment>
  </CreationInfo>
</div>

<style>
  /*  TODO: remove div after supporting comments and votes */
  div > :global(button) {
    display: none;
  }
</style>
