<script>import CreationInfo from 'san-webkit/lib/ui/CreationInfo/svelte';
import { CreationType } from 'san-webkit/lib/ui/Profile/types';
import { getAppContext } from './../context';
import { showSaveDashboardDialog } from './../SaveDashboardDialog.svelte';
export let dashboard;
export let currentUser;
export let isAuthor;
export let onCommentsClick;
const {
  dashboard$
} = getAppContext();

$: ({
  id,
  title,
  user,
  commentsCount,
  description = ''
} = dashboard);

function getState() {
  if (!dashboard.user) {
    return {
      title: 'New dashboard',
      action: 'Create'
    };
  }

  if (isAuthor) {
    return {
      title: 'Edit dashboard',
      action: 'Save'
    };
  }

  return {
    title: 'Duplicate dashboard',
    action: 'Duplicate'
  };
}

function onEditClick() {
  if (!currentUser) return;
  showSaveDashboardDialog(Object.assign(Object.assign({}, getState()), {
    dashboard
  })).then(dashboard => {
    if (dashboard) dashboard$.set(dashboard);
  });
}

function onVote() {}</script>

<div class="row mrg-a mrg--r">
  <CreationInfo
    fallback="Unsaved dashboard"
    type={CreationType.Dashboard}
    {id}
    {title}
    {user}
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
