<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import CreationInfo from 'webkit/ui/CreationInfo/svelte'
  import { CreationType } from 'webkit/ui/Profile/types'
  import Query from './Query.svelte'
  import Result from './Result.svelte'
  import Sidebar from './Sidebar/index.svelte'

  let isAuthor = true

  let commentsCount = 3

  let id = 0
  let title = 'My query'
  let user = {
    username: 'Tim_Jones',
  }
  let votes = {}

  function onEditClick() {}

  function onVote() {}
</script>

<div class="row">
  <Sidebar />

  <main>
    <div class="row v-center mrg-xl mrg--b">
      <CreationInfo
        fallback="Unsaved dashboard"
        type={CreationType.Layout}
        {id}
        {title}
        {user}
        {votes}
        currentUser={null}
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

      <button class="btn mrg-a mrg--l row v-center">
        <Svg id="copy" w="16" class="mrg-s mrg--r" />
        Duplicate</button>
      <button class="btn mrg-xl mrg--l row v-center">
        <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
        Share</button>
    </div>

    <Query />

    <Result />
  </main>
</div>

<style>
  main {
    padding: 24px 16px;
    background: var(--athens);
    min-height: 100vh;
  }

  button {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }
</style>
