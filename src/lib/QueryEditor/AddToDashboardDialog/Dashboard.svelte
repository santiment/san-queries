<script lang="ts">
  import type { queryGetUserQueries } from '$lib/api/query/get'
  import Profile from 'webkit/ui/Profile/svelte'
  import Svg from 'webkit/ui/Svg/svelte'

  export let user = {}
  export let dashboards = [] as Awaited<ReturnType<typeof queryGetUserQueries>>
  export let onAdd: (query: App.Dashboard.Query) => void

  let addedSet = new Set()

  function onAddClick(item) {
    if (addedSet.has(item)) return

    onAdd(item)

    addedSet.add(item)
    addedSet = addedSet

    setTimeout(() => {
      addedSet.delete(item)
      addedSet = addedSet
    }, 2000)
  }
</script>

<queries class="column gap-s">
  {#each dashboards as item}
    <dashboard class="btn row v-center gap-s">
      <Profile class="c-fiord" {user} source="query_to_dashboard" feature="dashboard" />

      <div class="br mrg" />

      <article class="row v-center gap-s">
        <Svg id="dashboard" w="12" />
        <span class="single-line">{item.name}</span>
      </article>

      <button class="btn-2 mrg-a mrg--l txt-center" on:click={() => onAddClick(item)}>
        {#if addedSet.has(item)}
          <Svg id="checkmark-circle-filled" w="16" />
        {:else}
          Add
        {/if}
      </button>
    </dashboard>
  {:else}
    No dashboards found
  {/each}
</queries>

<style>
  dashboard {
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
    min-width: 65px;
  }
</style>
