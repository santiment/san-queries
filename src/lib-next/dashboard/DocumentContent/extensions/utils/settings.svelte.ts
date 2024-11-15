import { untrack } from 'svelte'

export function useDeepChangeEffect<T>(
  sharedSignal: { $$: T } | { $: T },
  fn: (snapshot: T) => void,
) {
  let shouldSkipInit = true

  $effect(() => {
    const snapshot = $state.snapshot('$' in sharedSignal ? sharedSignal.$ : sharedSignal.$$)

    if (shouldSkipInit) {
      shouldSkipInit = false
      return
    }

    return untrack(() => fn(snapshot as T))
  })
}
