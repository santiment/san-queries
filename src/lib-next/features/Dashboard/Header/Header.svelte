<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'
  import { useDashboardCtx } from '../ctx'
  import Vote from './Vote.svelte'
  import Comments from './Comments.svelte'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'

  const { currentUser } = useCustomerCtx()
  const { dashboard } = useDashboardCtx.get()
</script>

<header class="flex items-center">
  <Button href="/">
    {dashboard.author?.username || '<hidden>'}
  </Button>

  {#if dashboard.state.$$.id}
    <div class="ml-3 mr-4 flex min-h-8 gap-3 border-l fill-fiord pl-3">
      <Vote dashboardId={dashboard.state.$$.id} votes={dashboard.state.$$.votes}></Vote>
      <Comments count={dashboard.state.$$.commentsCount}></Comments>
    </div>
  {/if}

  <div class="ml-auto flex items-center gap-4">
    {#if dashboard.isCurrentUserAuthor}
      {#if dashboard.isReadonly}
        <Button variant="fill" loading={false}>
          {dashboard.state.$$.isPublic ? 'Unpublish' : 'Publish'}
        </Button>

        <Button variant="border" icon="pencil" iconSize="10" href="/">Edit</Button>
      {:else}
        <Button variant="fill" loading={false} href="/">Preview</Button>

        <Button variant="border" icon="refresh" iconSize="10">Update</Button>
      {/if}
    {:else}
      Share
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
