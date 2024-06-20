<script lang="ts">
  import { showShareDialog } from 'san-webkit/lib/ui/Share/index.svelte'
  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import { showDashboardPublishedDialog$ } from '$lib/DashboardPublishedDialog/index.svelte'
  import Button from '$lib/ui/Button.svelte'
  import Popover from '$lib/ui/Popover'
  import User from '$lib/ui/User/index.svelte'
  import { cn } from '$lib/ui/utils'
  import { showGlobalParameterDialog$ } from './GlobalParameters/ParameterDialog.svelte'

  import { useToggleDashboardPublicity } from './flow/publicity'
  import Comments from './Comments.svelte'
  import Vote from './Vote.svelte'
  import { useDashboardEditorCtx } from '$lib/DashboardNext/ctx'

  let {
    dashboard,
    author,
    currentUser,

    onDuplicateClick,
    onDeleteClick,
  }: {
    dashboard?: Pick<App.ApiDashboard, 'commentsCount' | 'votes'>
    author: App.Author
    currentUser: null | {}

    onSaveClick?: () => void
    onDuplicateClick?: () => void
    onDeleteClick?: () => void
  } = $props()

  const showGlobalParameterDialog = showGlobalParameterDialog$()
  const showDashboardPublishedDialog = showDashboardPublishedDialog$()
  const { publishDashboard, unpublishDashboard } = useToggleDashboardPublicity()
  const { dashboardEditor } = useDashboardEditorCtx()
  const { readonly, isAuthor, isPublic } = dashboardEditor

  let isLoading = $state(false)

  function onAddGlobalParameterClick() {
    if (!dashboardEditor.id) return

    showGlobalParameterDialog({ strict: true }).then((parameter) => {
      dashboardEditor.parameters.$.push(parameter)
      dashboardEditor.parameters.$ = dashboardEditor.parameters.$
    })
  }

  function onPublicityToggleClick() {
    if (dashboardEditor.id) {
      isLoading = true

      const action = isPublic.$ ? unpublishDashboard : publishDashboard
      const flipped = !isPublic.$

      action({ dashboardId: dashboardEditor.id, onComplete })

      function onComplete() {
        isPublic.$ = flipped
        isLoading = false
        if (flipped) showDashboardPublishedDialog()
      }
    }
  }

  function onShareClick() {
    showShareDialog({
      entity: 'Dashboard',
      feature: 'dashboard',
      source: 'dashboard_head',
      data: {
        link:
          window.location.origin +
          `/dashboard/${getSEOLinkFromIdAndTitle(dashboardEditor.id!, dashboardEditor.name.$)}`,
      },
    })
  }
</script>

<header class="flex items-center">
  <User user={author || {}} class="text-waterloo" />

  {#if dashboard}
    <div class="ml-3 flex h-[32px] gap-3 border-l fill-fiord pl-3 text-waterloo">
      <Vote votes={dashboard.votes} votesFor={dashboard}></Vote>

      <Comments count={dashboard.commentsCount} commentsFor={dashboard}></Comments>
    </div>
  {/if}

  <div class="ml-auto mr-4 flex items-center">
    {#if isAuthor}
      {#if dashboard}
        {@const seoLink = getSEOLinkFromIdAndTitle( dashboardEditor.id!, dashboardEditor.name.$)}

        {#if readonly}
          <Button
            variant="fill"
            onclick={onPublicityToggleClick}
            class={cn(isLoading && 'loading')}
          >
            {isPublic.$ ? 'Unpublish' : 'Publish'}
          </Button>

          <Button
            variant="border"
            icon="pencil"
            iconSize="10"
            class="ml-4 bg-athens fill-waterloo hover:text-green"
            href="/dashboard/edit/{seoLink}"
          >
            Edit
          </Button>
        {:else}
          <Button variant="fill" class={cn(isLoading && 'loading')} href="/dashboard/{seoLink}">
            Preview
          </Button>
          <Button
            variant="border"
            icon="refresh"
            iconSize="10"
            class="ml-4 bg-athens fill-waterloo hover:text-green"
            onclick={() => alert('TODO')}>Update</Button
          >
        {/if}
      {/if}
    {:else}
      <Button variant="fill" onclick={onShareClick}>Share</Button>
    {/if}
  </div>

  <div class="flex gap-2">
    {#if isAuthor}
      <!-- <Button icon="refresh" /> -->

      <Button icon="share-dots" explanation="Share" onclick={onShareClick} />

      <Button icon="copy" explanation="Duplicate" onclick={onDuplicateClick} />

      <Popover placement="bottom-end">
        {#snippet children({ action, trigger })}
          <Button icon="vert-dots" {action} actionArgs={trigger} />
        {/snippet}

        {#snippet tooltip({ close })}
          <Button variant="ghost" action={close} onclick={onDeleteClick}>Delete</Button>
        {/snippet}
      </Popover>
    {:else if currentUser}
      <Button icon="copy" explanation="Duplicate" onclick={onDuplicateClick} />
    {/if}
  </div>
</header>
