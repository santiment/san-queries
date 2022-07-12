<script>
  import CreationInfo from 'webkit/ui/CreationInfo/svelte'
  import { CreationType } from 'webkit/ui/Profile/types'
  import { currentUser as currentUser$ } from 'studio/stores/user'

  let isAuthor = true

  let commentsCount = 3

  let votes = {}
  const dashboard = {
    id: 0,
    title: 'My query',
    user: {
      username: 'Tim_Jones',
    },
  }

  $: ({ id, title, user } = dashboard)
  $: currentUser = $currentUser$
  $: isAuthor = currentUser && user && +user.id === +currentUser.id

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
    onClick: null, // () => Sidewidget.set(SidewidgetType.LAYOUT_COMMENTS),
  }}
  {onEditClick}
  {onVote}>
  <svelte:fragment slot="info">123</svelte:fragment>
</CreationInfo>
