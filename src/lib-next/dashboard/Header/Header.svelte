<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'
  import Popover from 'san-webkit-next/ui/core/Popover'
  import { showShareDialog } from 'san-webkit/lib/ui/Share/index.svelte'
  import { getSEOLinkFromIdAndTitle } from 'san-webkit-next/utils/url'
  import User from '$lib/ui/User/index.svelte'
  import Vote from './Vote.svelte'
  import Comments from './Comments.svelte'
  import { useDashboardCtx } from '../ctx'
  import { useDashboardDeleteFlow } from '../flow/delete'
  import Svg from 'san-webkit-next/ui/core/Svg'

  type TProps = {
    onPublishToggle: () => void
    onDataUpdateClick: () => void
    onDuplicateClick: () => void
  }
  let { onPublishToggle, onDataUpdateClick, onDuplicateClick }: TProps = $props()

  const { currentUser } = useCustomerCtx()
  const { dashboard } = useDashboardCtx.get()

  const { deleteDashboard } = dashboard.isCurrentUserAuthor ? useDashboardDeleteFlow() : {}

  const id = $derived(dashboard.state.$$.id)

  function onShareClick() {
    const { id, name } = dashboard.state.$$
    showShareDialog({
      entity: 'Dashboard',
      feature: 'dashboard',
      source: 'dashboard_head',
      data: {
        link:
          window.location.origin + `/dashboard/${id ? getSEOLinkFromIdAndTitle(id, name) : 'new'}`,
      },
    })
  }
</script>

<header class="flex items-center">
  <User user={dashboard.author || { username: '<hidden>' }} class="text-waterloo"></User>

  {#if +(dashboard.author?.id ?? 0) === 144899}
    <Svg illus id="editorial" w="95" h="32" class="ml-2"></Svg>
  {/if}

  {#if id}
    {@const name = dashboard.state.$$.name}

    <div class="ml-3 mr-4 flex min-h-8 gap-3 border-l fill-fiord pl-3">
      <Vote dashboardId={+id} votes={dashboard.state.$$.votes}></Vote>
      <Comments
        commentsFor={{ id, title: name!, user: dashboard.author || {} }}
        bind:count={dashboard.state.$$.commentsCount}
      ></Comments>
    </div>
  {/if}

  <div class="ml-auto flex items-center gap-4">
    {#if dashboard.isCurrentUserAuthor}
      {#if id}
        {@const seoLink = getSEOLinkFromIdAndTitle(id, dashboard.state.$$.name)}
        {#if dashboard.isReadonly}
          <Button variant="fill" loading={false} onclick={onPublishToggle}>
            {dashboard.state.$$.isPublic ? 'Unpublish' : 'Publish'}
          </Button>

          <Button variant="border" icon="pencil" iconSize="10" href="/dashboard/edit/{seoLink}">
            Edit
          </Button>
        {:else}
          <Button
            variant="fill"
            loading={false}
            href={seoLink ? `/dashboard/${seoLink}` : undefined}
          >
            Preview
          </Button>

          <Button variant="border" icon="refresh" iconSize="10" onclick={onDataUpdateClick}>
            Update data
          </Button>
        {/if}
      {/if}
    {:else}
      <Button variant="fill" onclick={onShareClick}>Share</Button>
    {/if}
  </div>

  <div class="ml-4 flex gap-2">
    {#if dashboard.isCurrentUserAuthor}
      <Button icon="share-dots" explanation="Share" onclick={onShareClick}></Button>

      {#if id}
        <Button icon="copy" explanation="Duplicate" onclick={onDuplicateClick}></Button>

        <Popover side="bottom" align="end">
          {#snippet children({ props })}
            <Button {...props} icon="vert-dots" />
          {/snippet}

          {#snippet content({ close })}
            <Button
              variant="ghost"
              onclick={() => {
                deleteDashboard?.({ id })
                close()
              }}
            >
              Delete
            </Button>
          {/snippet}
        </Popover>
      {/if}
    {:else if currentUser.$$}
      {#if currentUser.$$?.email?.includes('@santiment.net')}
        <Button icon="copy" explanation="Duplicate" onclick={onDuplicateClick}></Button>
      {/if}
    {/if}
  </div>
</header>
