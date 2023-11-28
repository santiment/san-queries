<script lang="ts">
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Svg from 'webkit/ui/Svg/svelte'
  import { showShareDialog } from 'webkit/ui/Share/index.svelte'
  // import Tooltip from 'webkit/ui/Tooltip'
  import { VoteType } from 'webkit/api/vote'
  import LikeButton from 'webkit/ui/LikeButton/svelte'
  import Dropdown from '$lib/Dropdown'
  import { showDashboardPublishedDialog } from '$lib/DashboardPublishedDialog/index.svelte'
  import Comments from './Comments.svelte'
  import Head from '../index.svelte'

  export let dashboard = null as null | App.ApiDashboard
  export let author: SAN.Author | null
  export let isPublished = false

  const { currentUser$ } = getCurrentUser$Ctx()

  $: currentUser = $currentUser$
  $: isAuthor = currentUser?.id === author?.id

  function onShare() {
    showShareDialog({ entity: 'Dashboard', feature: '', source: '' })
  }
</script>

<Head {author} onMainClick={showDashboardPublishedDialog}>
  <LikeButton
    id={dashboard?.id}
    type={VoteType.Dashboard}
    votes={dashboard?.votes}
    onVote={console.log}
    source="queries_dashboard_vote"
    disabled={!dashboard?.id}
  />

  <Comments {dashboard} />

  <svelte:fragment slot="main-action">
    {#if isPublished}
      Update

      <Svg id="arrow-down" w="8" h="5" class="mrg-m mrg--l" />
    {:else}
      {isAuthor ? 'Publish' : 'Share'}
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="actions">
    {#if isAuthor}
      <button class="btn-3 expl-tooltip" aria-label="Update queries">
        <Svg id="refresh" w="16" />
      </button>
      <button class="btn-3 expl-tooltip" aria-label="Share" on:click={onShare}>
        <Svg id="share-dots" w="16" />
      </button>

      <Dropdown
        let:trigger
        actions={[
          ['Duplicate', console.log],
          ['Delete', console.log],
          ['Reset', console.log],
        ]}
      >
        <button use:trigger class="btn-3"><Svg id="vert-dots" w="3" h="16" /></button>
      </Dropdown>
    {:else if currentUser}
      <button class="btn-3"><Svg id="copy" w="16" /></button>
    {/if}
  </svelte:fragment>
</Head>

<style>
  LikeButton,
  Comments {
    border: none;
    padding-right: 0 !important;
  }
</style>
