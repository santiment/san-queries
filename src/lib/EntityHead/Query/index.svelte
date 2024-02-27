<script lang="ts">
  import { track } from 'webkit/analytics'
  import { noop } from 'webkit/utils'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import Svg from 'webkit/ui/Svg/svelte'
  import { showShareDialog } from 'webkit/ui/Share/index.svelte'
  import { getQueryEditor$Ctx } from '$routes/(editor)/query/ctx'
  import { queryGenerateTitleBySql } from './api'
  import ExecuteButton from './ExecuteButton.svelte'
  import Head from '../index.svelte'
  import Menu from './Menu.svelte'
  import { startSaveQueryFlow } from '$routes/(editor)/query/flow'
  import { goto } from '$app/navigation'
  import { getSEOLinkFromIdAndTitle } from 'san-webkit/lib/utils/url'
  import { notifications$ } from 'san-webkit/lib/ui/Notifications'
  import { EventQuerySaved$, EventSavingState$ } from '$routes/(editor)/query/events'

  export let author: SAN.Author | null
  export let quickSave = noop
  export let onQueryExecute = noop
  export let isAuthor = false

  const { currentUser$ } = getCurrentUser$Ctx()
  const { queryEditor$ } = getQueryEditor$Ctx()

  let titleNode: HTMLElement
  let typing = false

  $: queryEditor = $queryEditor$
  $: currentUser = $currentUser$
  $: isAuthor = currentUser?.id === author?.id
  $: mainActionLabel = currentUser ? 'Execute' : 'Log in to duplicate'

  function onGenerateTitleClick() {
    if (typing) return

    titleNode.textContent = ''
    typing = true

    let startTime = performance.now()

    queryGenerateTitleBySql(queryEditor.sql)
      .then((data) => {
        track.event('change_query_title', {
          category: 'Interaction',

          source: 'query_editor_header',
          is_ai_suggestion: true,
          ai_wait_time_ms: performance.now() - startTime,

          source_url: window.location.href,
        })

        const typewriter = Typewriter(data.title, titleNode)

        typewriter.start(() => {
          typing = false
          $queryEditor$.name = data.title
          $queryEditor$.description = data.description

          quickSave()
        })
      })
      .finally(() => {
        typing = false
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
    showShareDialog({ entity: 'Query', feature: 'query', source: 'query_head' })
  }

  function onMainActionClick() {
    if (mainActionLabel === 'Execute') return
  }

  function onDuplicateClick() {
    track.event('query_editor_duplicate_click', {
      category: 'Interaction',

      source_url: window.location.href,
    })

    startSaveQueryFlow({ ...queryEditor, query: null }, queryEditor.query?.isPublic)
      .then((apiQuery) => {
        EventQuerySaved$.dispatch(apiQuery)
        EventSavingState$.dispatch({ state: 'success' })

        return goto('/query/' + getSEOLinkFromIdAndTitle(apiQuery.id, apiQuery.name))
      })
      .then(() =>
        notifications$.show({
          type: 'success',
          title: 'Query duplicated!',
          dismissAfter: 5000,
        }),
      )
  }
</script>

<Head {author} onMainClick={onMainActionClick}>
  {#if isAuthor}
    <button
      class="ai btn mrg-s mrg--l expl-tooltip"
      aria-label="Ask AI to write the title based on your query"
      on:click={onGenerateTitleClick}
    >
      ✨
    </button>
  {/if}

  <button bind:this={titleNode} class="title btn body-2" class:typing on:click>
    {queryEditor.name || 'Untitled query'}
  </button>

  <svelte:fragment slot="main-action-wrap" let:classes>
    {#if mainActionLabel === 'Execute'}
      <ExecuteButton class={classes} {onQueryExecute} />
    {:else}
      <button class={classes} on:click={onMainActionClick}>
        {mainActionLabel}
      </button>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <!-- {#if isAuthor} -->
    <button class="btn-3 expl-tooltip" aria-label="Duplicate query" on:click={onDuplicateClick}
      ><Svg id="copy" w="16" /></button
    >
    <!--
    {:else}
      <button class="btn-3 expl-tooltip" aria-label="Refresh query"
        ><Svg id="refresh" w="16" /></button
      >
    {/if}
-->

    <button class="btn-3 expl-tooltip" aria-label="Share" on:click={onShare}>
      <Svg id="share-dots" w="16" />
    </button>

    {#if isAuthor}
      <Menu />
    {/if}
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
