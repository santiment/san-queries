<script context="module" lang="ts">
  import { Emitter, createCtx } from '$lib/ctx'

  export const useSaveIndicatorCtx = createCtx('useSaveIndicatorCtx', () => {
    const subject = new Subject<EventType>()
    const emit = (event: Exclude<EventType, EventType.Hidden>) => subject.next(event)

    const hideAfter = (ms: number) => of(EventType.Hidden).pipe(delay(ms))

    const timeout$ = of(EventType.Error).pipe(delay(15000))

    return {
      emit: Emitter(emit, {
        saving: EventType.Saving,
        success: EventType.Success,
        error: EventType.Error,
      }),

      state$: subject.pipe(
        switchMap((v) =>
          v === EventType.Saving
            ? concat(of(v), timeout$, hideAfter(3000))
            : merge(of(v), hideAfter(3000)),
        ),
        startWith(EventType.Hidden),
        share(),
      ),
    }
  })
</script>

<script lang="ts">
  import { Subject, concat, delay, merge, of, share, startWith, switchMap } from 'rxjs'
  import { useObservable } from 'svelte-runes'
  import { fade, scale, fly } from 'svelte/transition'
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { cn } from 'san-webkit-next/ui/utils'
  import { EventType } from './types'

  const { state$ } = useSaveIndicatorCtx()

  let _state = useObservable(state$)
  let state = $derived(_state.$)
</script>

{#if state !== EventType.Hidden}
  <section
    transition:fly={{ duration: 300, y: -60 }}
    class={cn(
      'fixed left-1/2 top-[14px] z-20 flex  -translate-x-1/2 items-center gap-2 rounded-3xl bg-casper-night px-4 py-2 text-white-day shadow-md',
    )}
  >
    <div class="relative flex min-h-4 min-w-4">
      {#if state === EventType.Saving}
        <loader transition:fade={{ duration: 130 }} class="loading-spin"></loader>
      {/if}

      {#if state === EventType.Success}
        <div transition:scale={{ duration: 220 }} class="absolute">
          <Svg id="checkmark-circle" class="fill-green"></Svg>
        </div>
      {/if}

      {#if state === EventType.Error}
        <div transition:scale={{ duration: 220 }} class="absolute">
          <Svg id="error" class="fill-red"></Svg>
        </div>
      {/if}
    </div>

    {#if state === EventType.Success}
      Saved
    {:else if state === EventType.Error}
      Error
    {:else}
      Saving
    {/if}
  </section>
{/if}
