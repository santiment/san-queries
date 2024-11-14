import { untrack } from 'svelte'

export function useDeepChangeEffect<T>(sharedSignal: { $$: T }, fn: (snapshot: T) => void) {
  let shouldSkipInit = true

  $effect(() => {
    const snapshot = $state.snapshot(sharedSignal.$$)

    if (shouldSkipInit) {
      shouldSkipInit = false
      return
    }

    return untrack(() => fn(snapshot as T))
  })
}
