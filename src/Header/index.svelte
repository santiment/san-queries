<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import { currentUser as currentUser$ } from 'studio/stores/user'
  import { getAppContext } from '@/context'
  import CreationInfo from './CreationInfo.svelte'
  import Comments from './Comments.svelte'
  import { showShareDialog } from '@/ShareDialog.svelte'
  import SaveButton from './SaveButton.svelte'

  const { dashboard$ } = getAppContext()

  export let columns

  let isCommentsShowed = false

  $: dashboard = $dashboard$
  $: currentUser = $currentUser$

  $: ({ user } = dashboard)
  $: isAuthor = currentUser && user && +user.id === +currentUser.id
</script>

<div class="row v-center mrg-xl mrg--b">
  <CreationInfo
    {currentUser}
    {dashboard}
    {columns}
    {isAuthor}
    onCommentsClick={() => (isCommentsShowed = !isCommentsShowed)} />

  <Comments bind:isCommentsShowed />

  <SaveButton class="$style.action" {user} {isAuthor} />

  <button
    class="btn mrg-xl mrg--l row v-center"
    on:click={() => showShareDialog({ title: 'Share dashboard', isAuthor })}>
    <Svg id="share-dots" w="14" h="16" class="mrg-s mrg--r" />
    Share</button>
</div>

<style>
  button,
  .action {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }
</style>
