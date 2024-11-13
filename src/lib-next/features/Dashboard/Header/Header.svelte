<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'
  import User from '$lib/ui/User/index.svelte'
  import { showShareDialog } from 'san-webkit/lib/ui/Share/index.svelte'
  import { getSEOLinkFromIdAndTitle } from 'san-webkit-next/utils/url'
  import Vote from './Vote.svelte'
  import Comments from './Comments.svelte'
  import { useDashboardCtx } from '../ctx'

  const { currentUser } = useCustomerCtx()
  const { dashboard } = useDashboardCtx.get()

  const id = $derived(dashboard.state.$$.id)

  function onShareClick() {
    const { id, name } = dashboard.state.$$
    showShareDialog({
      entity: 'Dashboard',
      feature: 'dashboard',
      source: 'dashboard_head',
      data: {
        link: window.location.origin + `/dashboard/${getSEOLinkFromIdAndTitle(id!, name)}`,
      },
    })
  }
</script>

<header class="flex items-center">
  <User user={dashboard.author || { username: '<hidden>' }} class="text-waterloo" />

  {#if dashboard.state.$$.id}
    <div class="ml-3 mr-4 flex min-h-8 gap-3 border-l fill-fiord pl-3">
      <Vote dashboardId={dashboard.state.$$.id} votes={dashboard.state.$$.votes}></Vote>
      <Comments count={dashboard.state.$$.commentsCount}></Comments>
    </div>
  {/if}

  <div class="ml-auto flex items-center gap-4">
    {#if dashboard.isCurrentUserAuthor}
      {@const seoLink = id && getSEOLinkFromIdAndTitle(id, dashboard.state.$$.name)}
      {#if dashboard.isReadonly}
        <Button variant="fill" loading={false}>
          {dashboard.state.$$.isPublic ? 'Unpublish' : 'Publish'}
        </Button>

        <Button variant="border" icon="pencil" iconSize="10" href="/dashboard-next/edit/{seoLink}">
          Edit
        </Button>
      {:else}
        <Button
          variant="fill"
          loading={false}
          href={seoLink ? '/dashboard-next/${seoLink}' : undefined}
        >
          Preview
        </Button>

        <Button variant="border" icon="refresh" iconSize="10">Update</Button>
      {/if}
    {:else}
      <Button variant="fill" onclick={id ? onShareClick : null}>Share</Button>
    {/if}
  </div>

  <div class="ml-4 flex gap-2">
    {#if dashboard.isCurrentUserAuthor}
      <Button icon="share-dots" explanation="Share"></Button>

      <Button icon="copy" explanation="Duplicate"></Button>
    {:else if currentUser.$$}
      <Button icon="copy" explanation="Duplicate"></Button>
    {/if}
  </div>
</header>
