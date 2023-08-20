<script lang="ts">
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Svg from 'webkit/ui/Svg/svelte'
  import Profile from 'webkit/ui/Profile/svelte'

  export let author: SAN.Author | null

  const { currentUser$ } = getCurrentUser$Ctx()

  $: currentUser = $currentUser$
  $: isAuthor = currentUser?.id === author?.id
  $: mainActionLabel = isAuthor ? 'Execute' : currentUser ? 'Duplicate' : 'Log in to duplicate'
</script>

<header class="row v-center gap-m mrg-s mrg--b">
  {#if author}
    <Profile user={author} source="queries_head" feature="query" />
  {:else}
    Your first query
  {/if}

  <div class="divider" />

  <button
    class="ai btn mrg-s mrg--l expl-tooltip"
    aria-label="Ask AI to write the title based on your query">✨</button
  >

  <button class="title btn body-2">Your first query</button>

  <button class="main-action btn-1 mrg-a mrg--l">{mainActionLabel}</button>

  <actions class="row v-center gap-s mrg-xs mrg--l">
    {#if isAuthor}
      <button class="btn-3"><Svg id="copy" w="16" /></button>
    {:else}
      <button class="btn-3"><Svg id="refresh" w="16" /></button>
    {/if}

    <button class="btn-3"><Svg id="share-dots" w="16" /></button>
    <button class="btn-3"><Svg id="vert-dots" w="3" h="16" /></button>
  </actions>
</header>

<style>
  header {
    padding: 24px 0 16px;
  }

  .divider {
    height: 32px;
    width: 1px;
    background: var(--mystic);
  }
</style>
