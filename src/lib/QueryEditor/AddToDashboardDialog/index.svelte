<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import Component from './index.svelte'

  export const showAddToDashboardDialog$ = () => dialogs.__WithCtx(Component)
</script>

<script lang="ts">
  import { SvelteSet as Set } from 'svelte/reactivity'
  import { delay, filter, mergeMap, of, switchMap, tap } from 'rxjs'
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import { queryGetMostRecent, type TEntity } from '$routes/explorer/api'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import Svg from '$lib/ui/Svg.svelte'
  import { useObserve } from 'svelte-runes'
  import Button from '$lib/ui/Button.svelte'
  import { mutateCreateDashboardQuery } from '$lib/Dashboard/flow/widgets/api'

  let { queryId, ...rest }: { queryId: number } = $props()

  type TDashboards = (TEntity & { type: 'dashboard' })[]

  let dashboards = $state.raw([] as TDashboards)
  let addedSet = new Set<TDashboards[number]>()

  const onAddClick = useObserveFnCall<TDashboards[number]>(() =>
    mergeMap((item) =>
      of(item).pipe(
        filter((item) => !addedSet.has(item)),
        tap((item) => addedSet.add(item)),
        mergeMap(() => mutateCreateDashboardQuery()({ dashboardId: +item.id, queryId })),
        delay(2000),
        tap(() => addedSet.delete(item)),
      ),
    ),
  )

  useObserve(() =>
    of(null).pipe(
      switchMap(() =>
        queryGetMostRecent()({ currentUserDataOnly: true, types: ['DASHBOARD'] }).pipe(
          tap((data) => (dashboards = data.items as TDashboards)),
        ),
      ),
    ),
  )
</script>

<Dialog
  {...rest}
  title="Add this query to a dashboard"
  class="h-full !max-h-[540px] w-full !max-w-[960px]"
>
  <div class="dialog-body px-6 py-8">
    {#each dashboards as item (item.id)}
      {@const isAdded = addedSet.has(item)}
      <section class="flex h-12 items-center gap-2 rounded-lg px-3 py-2 hover:bg-athens">
        <article class="flex min-w-0 items-center gap-2">
          <Svg id="dashboard" w="12" />
          <span class="single-line">{item.name || 'Untitled dashboard'}</span>
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
      </section>
    {/each}
  </div>
</Dialog>

<style lang="scss">
  actions {
    padding: 0px 32px 32px;
    fill: var(--green);
  }
</style>
