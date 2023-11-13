<script lang="ts">
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Svg from 'webkit/ui/Svg/svelte'
  import { showShareDialog } from 'webkit/ui/Share/index.svelte'
  import { queryGenerateTitleBySql } from './api'
  import Head from '../index.svelte'
  import { getQueryEditor$Ctx } from '$routes/query/new/ctx'
  import { GlobalShortcut$ } from 'san-webkit/lib/utils/events'

  export let author: SAN.Author | null
  export let title = 'Your first query'
  export let sql = ''

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = getQueryEditor$Ctx()

  let titleNode: HTMLElement
  let typing = false

  $: console.log($queryEditor$)
  $: currentUser = $currentUser$
  $: isAuthor = currentUser?.id === author?.id
  $: mainActionLabel = isAuthor ? 'Execute' : currentUser ? 'Duplicate' : 'Log in to duplicate'

  function onGenerateTitleClick() {
    if (typing) return

    titleNode.textContent = ''
    typing = true

    queryGenerateTitleBySql(sql).then((data) => {
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

  function onShare() {
    showShareDialog({ entity: 'Query', feature: '', source: '' })
  }

  function onMainActionClick() {
    if (mainActionLabel === 'Execute') {
      onExecuteClick()
    }
  }

  function onExecuteClick() {
    queryEditor$.querySqlData()
  }

  const runShortcut = GlobalShortcut$('CMD+ENTER', onExecuteClick, false)
  $runShortcut
</script>

<Head {author} onMainClick={onMainActionClick}>
  <button
    class="ai btn mrg-s mrg--l expl-tooltip"
    aria-label="Ask AI to write the title based on your query"
    on:click={onGenerateTitleClick}
  >
    ✨
  </button>

  <button bind:this={titleNode} class="title btn body-2" class:typing>{title}</button>

  <svelte:fragment slot="main-action">
    {mainActionLabel}
  </svelte:fragment>

  <svelte:fragment slot="actions">
    {#if isAuthor}
      <button class="btn-3"><Svg id="copy" w="16" /></button>
    {:else}
      <button class="btn-3"><Svg id="refresh" w="16" /></button>
    {/if}

    <button class="btn-3 expl-tooltip" aria-label="Share" on:click={onShare}>
      <Svg id="share-dots" w="16" />
    </button>
    <button class="btn-3"><Svg id="vert-dots" w="3" h="16" /></button>
  </svelte:fragment>
</Head>

<style>
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
