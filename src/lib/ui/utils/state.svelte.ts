import { untrack } from 'svelte'
import { Subject, share, type Observable, type UnaryFunction } from 'rxjs'

export function useObserveFnCall<Data = undefined>(
  fn: <T>() => UnaryFunction<T extends Observable<unknown> ? any : Observable<Data>, any>,
) {
  const subject = new Subject<Data>()

  $effect(() =>
    untrack(() => {
      const subscriber = subject.pipe(fn(), share()).subscribe()
      return () => {
        subscriber.unsubscribe()
        subject.complete()
      }
    }),
  )

  type Result = Data extends undefined ? () => void : (data: Data) => void

  return ((data) => subject.next(data)) as Result
}
