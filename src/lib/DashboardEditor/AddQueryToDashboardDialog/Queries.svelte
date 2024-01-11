<script lang="ts">
  import type { queryGetUserQueries } from '$lib/api/query/get'
  import { track } from 'san-webkit/lib/analytics'
  import Profile from 'webkit/ui/Profile/svelte'
  import Svg from 'webkit/ui/Svg/svelte'

  export let tab: any
  export let queries = [] as Awaited<ReturnType<typeof queryGetUserQueries>>
  export let onQueryAdd: (query: App.Dashboard.Query) => void

  let addedSet = new Set()
  function onAddClick(item) {
    if (addedSet.has(item)) return

    track.event('add_query_to_dashboard', {
      category: 'Interaction',
      source: 'add_queries_to_dashboard_dialog',

      tab: tab.title,
      source_url: window.location.href,
    })

    onQueryAdd(item)

    addedSet.add(item)
    addedSet = addedSet

    setTimeout(() => {
      addedSet.delete(item)
      addedSet = addedSet
    }, 2000)
  }
</script>

<queries class="column gap-s">
  {#each queries as item}
    <query class="btn row v-center gap-s">
      <Profile
        class="c-fiord"
        user={item.user}
        source="queries_add_query_to_dashboard"
        feature="query"
      />

      <div class="br mrg" />

      <article class="row v-center gap-s">
        <Svg id="table" w="12" />
        <span class="single-line">{item.name || 'Untitled query'}</span>
      </article>

      <button class="btn-2 mrg-a mrg--l" on:click={() => onAddClick(item)}>
        {#if addedSet.has(item)}
          <Svg id="checkmark-circle-filled" w="16" />
        {:else}
          Add
        {/if}
      </button>
    </query>
  {/each}
</queries>

<style>
  query {
    height: 48px;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: initial;
    --bg-hover: var(--athens);
    --img-size: 24px;
  }

  Profile {
    min-width: fit-content !important;
    --name-max-width: 100px;
  }

  .br {
    height: 24px;
    background: var(--mystic);
    width: 1px;
  }

  article {
    min-width: 0;
  }

  button {
    --bg: var(--white);
    --bg-hover: var(--white);
    fill: var(--green);
  }
</style>
