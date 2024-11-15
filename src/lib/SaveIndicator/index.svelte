<script module lang="ts">
  import { createCtx } from 'san-webkit-next/utils'
  import { Emitter } from '$lib/ctx'

  export const useSaveIndicatorCtx = createCtx('queries_useSaveIndicatorCtx', () => {
    const subject = new ReplaySubject<EventType>(1)
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
      ),
    }
  })
</script>

<script lang="ts">
  import { ReplaySubject, concat, delay, merge, of, startWith, switchMap } from 'rxjs'
  import { fade, scale, fly } from 'svelte/transition'
  import Svg from 'san-webkit-next/ui/core/Svg'
  import { cn } from 'san-webkit-next/ui/utils'
  import { EventType } from './types'

  const { state$ } = useSaveIndicatorCtx()

  let state = $derived($state$)
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
