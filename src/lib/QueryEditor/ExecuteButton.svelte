<script lang="ts" module>
  import type { ComponentProps } from 'svelte'

  import { createCtx, Emitter } from '$lib/ctx'

  export const useExecuteButtonCtx = createCtx('useExecuteButtonCtx ', () => {
    const subjet = new Subject<EventType>()
    const emit = (event: EventType) => subjet.next(event)

    return {
      emit: Emitter(emit, {
        default: EventType.Default,
        loading: EventType.Loading,
      }),

      state$: subjet.pipe(startWith(EventType.Default)),
    }
  })
</script>

<script lang="ts">
  import { Subject, startWith } from 'rxjs'
  import { useObservable } from 'svelte-runes'
  import Button from '$lib/ui/Button.svelte'
  import { EventType } from './types'

  let { ...props }: ComponentProps<Button> = $props()

  const { state$ } = useExecuteButtonCtx()
  let state = useObservable(state$)
</script>

<Button {...props} variant="fill">
  {#if state.$ === EventType.Default}
    Execute
  {:else if state.$ === EventType.Loading}
    Executing

    <div class="loading w-5" style:--color="var(--white)"></div>
  {/if}
</Button>
