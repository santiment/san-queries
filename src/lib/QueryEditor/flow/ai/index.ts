import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
import { Subject, catchError, debounceTime, delay, exhaustMap, of, pipe, tap } from 'rxjs'
import { queryGenerateTitleByQuery } from './api'

export function useAiSuggestion() {
  const data$ = new Subject()

  const getAiTitleAndDescription = useObserveFnCall<string>(() =>
    pipe(
      debounceTime(150),
      exhaustMap((sql) => queryGenerateTitleByQuery()(sql)),
      delay(500),
      tap((data) => data$.next(data)),
      catchError(() => of(undefined)),
    ),
  )

  return { data$, getAiTitleAndDescription }
}
