<script>
  import CreationInfo from 'webkit/ui/CreationInfo/svelte'
  import { CreationType } from 'webkit/ui/Profile/types'
  import { currentUser as currentUser$ } from 'studio/stores/user'
  import { getAppContext } from '@/context'
  import { CommentsType } from 'san-webkit/lib/api/comments'

  export let onCommentsClick

  const ctx = getAppContext()
  const { dashboard$ } = ctx

  let isAuthor = true

  $: dashboard = $dashboard$
  $: currentUser = $currentUser$

  $: ({ id, title, user, commentsCount, votes, description } = dashboard || {})
  $: isAuthor = currentUser && user && +user.id === +currentUser.id

  $: console.log(dashboard)

  function onEditClick() {
    if (!currentUser) return

    // if (isAuthor)
    const handler = dashboard ? (isAuthor ? 0 : 1) : 2

    console.log({ handler })
  }

  function onVote() {}
</script>

<CreationInfo
  fallback="Unsaved dashboard"
  type={CreationType.Layout}
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
