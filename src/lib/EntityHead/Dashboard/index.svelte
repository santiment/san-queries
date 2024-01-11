<script lang="ts">
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip'
  import { showShareDialog } from 'webkit/ui/Share/index.svelte'
  // import Tooltip from 'webkit/ui/Tooltip'
  import { VoteType } from 'webkit/api/vote'
  import LikeButton from 'webkit/ui/LikeButton/svelte'
  import Dropdown from '$lib/Dropdown'
  import { showDashboardPublishedDialog } from '$lib/DashboardPublishedDialog/index.svelte'
  import Comments from './Comments.svelte'
  import Head from '../index.svelte'
  import { noop } from 'san-webkit/lib/utils'
  import { track } from 'san-webkit/lib/analytics'
  import { startLegacyMigrationFlow } from '$lib/api/dashboard/legacy'
  import {
    EventDashboardDeleted$,
    EventDashboardUpdateQueries$,
  } from '$routes/(editor)/query/events'
  import { goto } from '$app/navigation'
  import { mutateDeleteDashboard } from '$lib/api/dashboard/delete'
  import { getDashboardEditor$Ctx } from '$routes/(editor)/dashboard/[[slug]]/ctx'
  import { startDashboardSaveFlow } from '$routes/(editor)/dashboard/[[slug]]/flow'
  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import { notifications$ } from 'san-webkit/lib/ui/Notifications'

  export let dashboard = null as null | App.ApiDashboard
  export let author: SAN.Author | null
  export let saveDashboard = noop

  const { currentUser$ } = getCurrentUser$Ctx()

  $: currentUser = $currentUser$
  $: isAuthor = currentUser?.id === author?.id
  $: isPublished = isAuthor && dashboard?.isPublic
  $: isLegacy = isAuthor && dashboard?.isLegacy

  function onShare() {
    showShareDialog({ entity: 'Dashboard', feature: 'dashboard', source: 'dashboard_head' })
  }

  let isMigrating = false
  function onMainClick() {
    if (isLegacy) {
      if (isMigrating) return

      isMigrating = true

      track.event('migrate_legacy_dashboard', {
        category: 'Interaction',
        id: dashboard?.id,

        source_url: window.location.href,
      })

      if (dashboard) {
        startLegacyMigrationFlow(dashboard).then(() => {
          isMigrating = false
          window.location.reload()
        })
      }

      return
    }

    if (isAuthor) {
      if (!isPublished) {
        if (dashboard) {
          dashboard.isPublic = true
          showDashboardPublishedDialog()
        }
        return saveDashboard()
      }
    }
  }

  function onMenuClick() {
    track.event('dashboard_editor_menu_open', {
      category: 'Interaction',
      source_url: window.location.href,
    })
  }

  let DropdownNode: Dropdown

  function onDeleteClick() {
    if (!dashboard) return

    DropdownNode.close()
    track.event('dashboard_editor_menu_delete_click', {
      category: 'Interaction',
      source_url: window.location.href,
    })

    const isConfirmed = confirm(`Delete this dashboard?
This action can't be undone`)
    if (!isConfirmed) return

    EventDashboardDeleted$.dispatch(dashboard)
  }

  const { dashboardEditor$ } = getDashboardEditor$Ctx()

  function onDuplicateClick() {
    track.event('dashboard_editor_menu_duplicate_click', {
      category: 'Interaction',
      source_url: window.location.href,
    })

    const dashboardEditor = $dashboardEditor$

    startDashboardSaveFlow({
      ...dashboardEditor,
      widgets: dashboardEditor.widgets.map((widget) => ({ ...widget, id: null })),
      dashboard: null,
    })
      .then((apiDashboard) =>
        goto('/dashboard/' + getSEOLinkFromIdAndTitle(apiDashboard.id, apiDashboard.name)),
      )
      .then(() => {
        notifications$.show({
          type: 'success',
          title: 'Dashboard duplicated!',
        })
      })
  }

  const eventDashboardDeleted = EventDashboardDeleted$(onDashboardDeleted)
  $eventDashboardDeleted

  function onDashboardDeleted({ id }: { id: number }) {
    mutateDeleteDashboard(id)

    // const selectedQuery = dashboardEDito

    if (dashboard?.id === id) {
      goto('/dashboard/new')
    }
  }

  function onUpdateQueriesClick() {
    track.event('dashboard_editor_update_queries_click', {
      category: 'Interaction',
      source_url: window.location.href,
    })

    EventDashboardUpdateQueries$.dispatch()
  }
</script>

<Head {author}>
  <LikeButton
    id={dashboard?.id}
    type={VoteType.Dashboard}
    votes={dashboard?.votes || { userVotes: 0, totalVotes: 0 }}
    onVote={console.log}
    source="queries_dashboard_vote"
    disabled={!dashboard?.id}
  />

  <Comments {dashboard} />

  <svelte:fragment slot="main-action-wrap" let:classes>
    {#if isPublished}
      <Tooltip let:trigger on="click" position="bottom" clickaway>
        <button use:trigger class="update btn-1">
          Update

          <Svg id="arrow-down" w="8" h="5" class="mrg-m mrg--l" />
        </button>

        <svelte:fragment slot="tooltip" let:close>
          <button class="btn-ghost" on:click={close}>Publish updates</button>
          <button class="btn-ghost" on:click={close}>Unpublish</button>
        </svelte:fragment>
      </Tooltip>
    {:else}
      <button class={classes} on:click={onMainClick} class:loading={isMigrating}>
        {isAuthor ? (isLegacy ? 'Migrate' : 'Publish') : 'Share'}
      </button>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="actions">
    {#if !isLegacy}
      {#if isAuthor}
        <button
          class="btn-3 expl-tooltip"
          aria-label="Update queries"
          on:click={onUpdateQueriesClick}
        >
          <Svg id="refresh" w="16" />
        </button>
        <button class="btn-3 expl-tooltip" aria-label="Share" on:click={onShare}>
          <Svg id="share-dots" w="16" />
        </button>

        <Dropdown
          bind:this={DropdownNode}
          let:trigger
          actions={[
            ['Duplicate', onDuplicateClick],
            ['Delete', onDeleteClick],
          ]}
        >
          <button on:click={onMenuClick} use:trigger class="btn-3"
            ><Svg id="vert-dots" w="3" h="16" /></button
          >
        </Dropdown>
      {:else if currentUser}
        <button class="btn-3"><Svg id="copy" w="16" /></button>
      {/if}
    {/if}
  </svelte:fragment>
</Head>

<style>
  LikeButton,
  Comments {
    border: none;
    padding-right: 0 !important;
  }

  Tooltip {
    padding: 8px;
  }

  .update {
    padding: 6px 12px;
  }
</style>
