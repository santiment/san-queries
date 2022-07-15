<script>
  import Comments from 'webkit/ui/Comments/svelte'
  import { CommentsType } from 'san-webkit/lib/api/comments'

  export let isCommentsShowed = false
</script>

{#if isCommentsShowed}
  <div id="comments">
    <div class="bg fluid" on:click={() => (isCommentsShowed = false)} />
    <div class="column border mrg-a mrg--l">
      <Comments
        type={CommentsType.Insight}
        commentsFor={{
          id: 16457,
          user: {
            id: 113,
          },
        }}
        currentUser={{
          id: '113',
          following: {
            users: [],
          },
        }} />
    </div>
  </div>
{/if}

<style>
  #comments {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 30;
  }
  .bg {
    background: #000;
    opacity: 0.6;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
  }

  .border {
    width: 400px;
    position: sticky;
    top: 0;
    height: 100vh;
    padding: 16px 24px;
    border-radius: 0;
    z-index: 2;
  }
</style>
