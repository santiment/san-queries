<script lang="ts">
  import { getCurrentUser$Ctx } from 'san-webkit/lib/stores/user'
  import CommentsButton from 'webkit/ui/Comments/Button.svelte'
  import { CommentsType } from 'webkit/api/comments'
  import Comments from 'webkit/ui/Comments/svelte'

  let className = ''
  export { className as class }
  export let dashboard: any

  const { currentUser$ } = getCurrentUser$Ctx()

  let isOpened = false
  $: count = dashboard?.commentsCount ?? 0

  function start(node: HTMLElement) {
    setTimeout(() => node.classList.add('$style.opened'), 10)
    return {}
  }

  function end(node: HTMLElement) {
    node.classList.remove('$style.opened')
    return { duration: 500 }
  }

  function onNewComment(_: any, comments: any[]) {
    count = comments.length
  }
</script>

<CommentsButton class={className} {count} on:click={() => (isOpened = !!dashboard)} />

{#if isOpened}
  <comments class="column" in:start out:end>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <clickaway on:click={() => (isOpened = false)} />

    <main class="column mrg-a mrg--l">
      <Comments
        type={CommentsType.Dashboard}
        commentsFor={dashboard}
        currentUser={$currentUser$}
        {onNewComment}
      />
    </main>
  </comments>
{/if}

<style lang="scss">
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

  .opened {
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
