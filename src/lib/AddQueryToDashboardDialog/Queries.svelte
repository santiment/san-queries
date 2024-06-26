<script lang="ts">
  import { delay, filter, pipe, tap } from 'rxjs'
  import { Set } from 'svelte/reactivity'
  import Button from '$lib/ui/Button.svelte'
  import Svg from '$lib/ui/Svg.svelte'
  import User from '$lib/ui/User/index.svelte'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import VirtualList from 'san-webkit-next/ui/app/VirtualList'

  let { tab, queries, onQueryAdd }: { tab: any } = $props()

  let addedSet = new Set()

  const onAddClick = useObserveFnCall<any>(() =>
    pipe(
      filter((item) => !addedSet.has(item)),

      tap(onQueryAdd),

      tap((item) => addedSet.add(item)),
      delay(2000),
      tap((item) => addedSet.delete(item)),
    ),
  )
</script>

<queries class="flex flex-1 flex-col gap-2">
  <VirtualList data={queries} getKey={(v) => v.id}>
    {#snippet children({ item })}
      <!-- {#each queries as item} -->
      {@const isAdded = addedSet.has(item)}
      <query class="flex h-12 items-center gap-2 rounded-lg px-3 py-2 hover:bg-athens">
        <User
          class="text-fiord"
          user={item.user}
          source="queries_add_query_to_dashboard"
          feature="query"
        />

        <div class="br mrg" />

        <article class="flex min-w-0 items-center gap-2">
          <Svg id="table" w="12" />
          <span class="single-line">{item.name || 'Untitled query'}</span>
        </article>

        <Button
          variant="border"
          class={'ml-auto min-h-8 min-w-[67px] justify-center fill-green'}
          onclick={() => onAddClick(item)}
        >
          {#if isAdded}
            <Svg id="checkmark-circle-filled" w="16" />
          {:else}
            Add
          {/if}
        </Button>
      </query>
      <!-- {/each} -->
    {/snippet}
  </VirtualList>
</queries>

<style>
  query {
    --img-size: 24px;
  }

  User {
    min-width: fit-content !important;
    --name-max-width: 100px;
  }

  .br {
    height: 24px;
    background: var(--mystic);
    width: 1px;
  }
</style>
