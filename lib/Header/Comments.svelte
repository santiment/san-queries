<script>import Comments from 'san-webkit/lib/ui/Comments/svelte';
import { CommentsType } from 'san-webkit/lib/api/comments';
import { currentUser as currentUser$ } from 'san-studio/lib/stores/user';
import { getAppContext } from './../../lib/context';
export let isCommentsShowed = false;
const ctx = getAppContext();
const {
  dashboard$
} = ctx;

$: dashboard = $dashboard$;

$: currentUser = $currentUser$;</script>

{#if isCommentsShowed && dashboard.user}
  <div id="comments">
    <div class="bg fluid" on:click={() => (isCommentsShowed = false)} />
    <div class="column border mrg-a mrg--l">
      <Comments type={CommentsType.Dashboard} commentsFor={dashboard} {currentUser} />
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
