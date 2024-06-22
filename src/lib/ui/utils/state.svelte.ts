import { untrack } from 'svelte'
import { Subject, Subscription, share, type Observable, type UnaryFunction } from 'rxjs'

export function useOnClient(fn: () => void) {
  $effect(() => untrack(fn))
}

export function useObserveFnCall<Data = undefined>(
  fn: <T>() => UnaryFunction<T extends Observable<unknown> ? any : Observable<Data>, any>,
) {
  const subject = new Subject<Data>()
  let subscriber: Subscription

  $effect(() =>
    untrack(() => {
      const subscriber = ensureSubscription()

      return () => {
        subscriber.unsubscribe()
        subject.complete()
      }
    }),
  )

  function ensureSubscription() {
    if (subscriber) return subscriber

    return (subscriber = subject.pipe(fn(), share()).subscribe())
  }

  type Result = Data extends undefined ? () => void : (data: Data) => void

  return ((data) => {
    ensureSubscription()
    subject.next(data)
  }) as Result
}
