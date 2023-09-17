<script lang="ts">
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Svg from 'webkit/ui/Svg/svelte'
  import Profile from 'webkit/ui/Profile/svelte'
  import { queryGenerateTitleBySql } from './api'

  export let author: SAN.Author | null
  export let title = 'Your first query'

  const { currentUser$ } = getCurrentUser$Ctx()

  let titleNode: HTMLElement
  let typing = false

  $: currentUser = $currentUser$
  $: isAuthor = currentUser?.id === author?.id
  $: mainActionLabel = isAuthor ? 'Execute' : currentUser ? 'Duplicate' : 'Log in to duplicate'

  function onGenerateTitleClick() {
    if (typing) return

    titleNode.textContent = ''
    typing = true

    queryGenerateTitleBySql('select * from table').then((data) => {
      const typewriter = Typewriter(data.title, titleNode)

      typewriter.start(() => {
        typing = false
        title = data.title
      })
    })
  }

  function Typewriter(txt: string, node: HTMLElement) {
    let i = 0
    let timerId: number

    function typewrite(onEnd?: () => void) {
      if (i >= txt.length) {
        return onEnd?.()
      }

      node.textContent += txt[i]
      i++
      timerId = window.setTimeout(() => typewrite(onEnd), 70)
    }

    return {
      start: typewrite,
      stop: () => window.clearTimeout(timerId),
    }
  }
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
    aria-label="Ask AI to write the title based on your query"
    on:click={onGenerateTitleClick}
  >
    ✨
  </button>

  <button bind:this={titleNode} class="title btn body-2" class:typing>{title}</button>

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

  .typing::after {
    content: '▌';
    display: inline-block;
    color: var(--casper);
    animation: opacity 1.1s infinite;
  }

  @keyframes opacity {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }
  }
</style>
