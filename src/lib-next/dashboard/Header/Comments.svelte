<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'
  import Comments from 'san-webkit/lib/ui/Comments/svelte'
  import { CommentsType } from 'san-webkit/lib/api/comments'
  import { useCustomerCtx } from 'san-webkit-next/ctx/customer'
  import type { TAuthor } from '../types'

  type TProps = {
    count: number
    commentsFor: { id: number; title: string; user: TAuthor }
  }
  let { commentsFor, count = $bindable<number>() }: TProps = $props()

  const { currentUser } = useCustomerCtx()

  let isOpened = $state(false)

  function onNewComment(_: any, comments: any[]) {
    count = comments.length
  }
</script>

<Button
  icon="comment"
  class="gap-1.5"
  onclick={() => {
    isOpened = true
  }}>{count}</Button
>

{#if isOpened}
  <div class="comments opened-comments items-end column">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="clickaway" onclick={() => (isOpened = false)}></div>

    <main class="mrg-a mrg--l column">
      <Comments
        type={CommentsType.Dashboard}
        commentsFor={commentsFor as any}
        currentUser={currentUser.$$ as any}
        {onNewComment}
      />
    </main>
  </div>
{/if}

<style lang="postcss">
  .comments {
    position: fixed;
    top: 65px;
    z-index: 12;
  }

  .clickaway {
    content: '';
    background: #000;
    position: absolute;
    top: 0;
    z-index: -1;
    opacity: var(--opacity, 0);
    transition: opacity 0.25s;
  }

  .comments,
  .clickaway {
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
