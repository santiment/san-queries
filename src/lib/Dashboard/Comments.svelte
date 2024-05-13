<script lang="ts">
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import { CommentsType } from 'san-webkit/lib/api/comments'
  import Comments from 'san-webkit/lib/ui/Comments/svelte'
  import Button from '$lib/ui/Button.svelte'

  let { count, commentsFor }: { count: number; commentsFor: any } = $props()

  const { currentUser$ } = getCurrentUser$Ctx()

  let isOpened = $state(false)

  function start(node: HTMLElement) {
    setTimeout(() => node.classList.add('opened-comments'), 10)
    return {}
  }

  function end(node: HTMLElement) {
    node.classList.remove('opened-comments')
    return { duration: 500 }
  }

  function onNewComment(_: any, comments: any[]) {
    count = comments.length
  }
</script>

<Button icon="comment" class="gap-1.5" onclick={() => (isOpened = true)}>{count}</Button>

{#if isOpened}
  <comments class="column" in:start out:end>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <clickaway on:click={() => (isOpened = false)} />

    <main class="column mrg-a mrg--l">
      <Comments
        type={CommentsType.Dashboard}
        {commentsFor}
        currentUser={$currentUser$}
        {onNewComment}
      />
    </main>
  </comments>
{/if}

<style lang="postcss">
  comments {
    position: fixed;
    top: 65px;
    z-index: 12;
  }

  clickaway {
    content: '';
    background: #000;
    position: absolute;
    top: 0;
    z-index: -1;
    opacity: var(--opacity, 0);
    transition: opacity 0.25s;
  }

  comments,
  clickaway {
    left: 0;
    bottom: 0;
    right: 0;
  }

  :global(.opened-comments) {
    --opacity: 0.5;
    --translate: 0;
  }

  main {
    width: 480px;
    background: var(--white);
    height: 100%;
    translate: var(--translate, 100%);
    transition: translate 250ms ease-out;
    padding: 16px 36px 16px 24px;
  }
</style>
