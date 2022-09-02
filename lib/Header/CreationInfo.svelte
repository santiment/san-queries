<script lang="ts">import 'san-webkit/lib/ui/Notifications';
import CreationInfo from 'san-webkit/lib/ui/CreationInfo/svelte';
import { CreationType } from 'san-webkit/lib/ui/Profile/types';
import { getAppContext } from './../../lib/context';
import { showSaveDashboardDialog } from './../../lib/SaveDashboardDialog.svelte';
import './../../lib/api/dashboard/create';
import './../../lib/api/dashboard/update';
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
  votes,
  description
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
  const handler = getState();
  showSaveDashboardDialog(Object.assign(Object.assign({}, getState()), {
    dashboard
  })).then(dashboard => {
    if (dashboard) dashboard$.set(dashboard);
  });
}

function onVote() {}</script>

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
